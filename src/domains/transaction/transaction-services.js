import camelize from "camelize";
import BaseError from "../../base_classes/base-error.js";
import { convertKeysToSnakeCase } from "../../utils/convert-key.js";
import TransactionRepository from "./transaction-repository.js";
import { snakeCase } from "change-case";
import crypto from "crypto";
import OrderRepository from "../order/order-repository.js";
import MenuRepository from "../menu/menu-repository.js";
import ReservasiRepository from "../reservasi/reservasi-repository.js";

class TransactionServices {
    constructor() {
        this.TransactionRepository = TransactionRepository;
        this.OrderRepository = OrderRepository;
        this.MenuRepository = MenuRepository
        this.ReservasiRepository = ReservasiRepository;
    }

    async createTransaction(data){
        const dataSnakeCase = convertKeysToSnakeCase(data);
        const transaction = await this.TransactionRepository.create(dataSnakeCase);

        return camelize(transaction);
    }

    async updateStatusTransaction(id, status){
        const transaction = await this.TransactionRepository.update(id, { status : status });

        return camelize(transaction);
    }
    
    async generatePayment(data){
        data = convertKeysToSnakeCase(data);

        const order = await this.OrderRepository.getByIdWithRelation(data.order_id);

        if (!order || order.deleted_at){
            throw BaseError.notFound("Order not found");
        }

        if (order.status === "CANCELED"){
            throw BaseError.badRequest("Order already canceled");
        }

        let gross_total = order.order_detail.reduce((acc, order_detail) => {
            return acc + (order_detail.qty * order_detail.price);
        }, 0);

        let paid = 0

        if (order.transaction.length > 0){
            paid = order.transaction.reduce((acc, transaction) => {
                if (transaction.status === "settlement" || transaction.status === "capture"){
                    return acc + (transaction.gross_amount - transaction.admin_fee)
                }

                return acc;
            }, 0)
        }

        const remaining = gross_total - paid;

        if (remaining < 0) {
            throw BaseError.badRequest("Order is overpaid");
        } else if (remaining === 0) {
            throw BaseError.badRequest("Order already paid");
        }

        let order_id = order.id;

        if (order.transaction.length == 1){
            order_id = `${order_id}-${new Date().getTime()}`;
        }

        const params = {
            where: {
                order_id: order.id,
                status: "pending"
            }
        }

        const pendingTransaction = await this.TransactionRepository.get(params);

        if (pendingTransaction.total > 0){
            const authString = btoa(`${process.env.MIDTRANS_SERVER_KEY}:`);

            for (const transaction of pendingTransaction.data){
                const response = await fetch(`${process.env.MIDTRANS_APP_API_URL}/v2/${transaction.trx_id}/expire`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Basic ${authString}`,
                    }
                })

                if (response.status !== 200){
                    // console.log(await response.json())
                    throw Error("Failed to expire transaction");
                }

            
                console.log("Success Update Transaction Status to Expire", transaction.trx_id);
            }
        }
        

        if (!order.reservasi_id){
            return await this.TransactionRepository.withTransaction(async (tx) => {
                return await this.createMidtransTransaction(tx, order.id, data.payment_method);
            })
        }
            
        return await this.TransactionRepository.withTransaction(async (tx) => {
            return await this.createMidtransTransaction(tx, order.id, data.payment_method);
        })
    }


    async createMidtransTransaction(tx, orderId, paymentMethod) {
        const dataOrder = await tx.order.findUnique({   
            where: {
                id: orderId
            },
            include:{
                reservasi: {
                    include : {
                    detail_reservasis: {
                        include: {
                            table : true
                        }
                    }
                    }
                },
                transaction: true,
                order_detail : {
                    include: {
                        menu : true
                    }
                }, 
            }
        }, {
            maxWait: 10000, // 10 seconds max wait to connect to prisma
            timeout: 20000, // 20 seconds before the transaction times out
        });

        if (!dataOrder){
            throw Error("Failed to find order");
        }

        const authString = btoa(`${process.env.MIDTRANS_SERVER_KEY}:`);

        let gross_amount = dataOrder.order_detail.reduce((acc, order_detail) => {
            return acc + (order_detail.qty * order_detail.price);
        }, 0);

        let item_details = dataOrder.order_detail.map((order_detail) => ({
            id: order_detail.menu_id,
            price: order_detail.price,
            quantity: order_detail.qty,
            name: order_detail.menu.name
        }));

        let id_order = dataOrder.id;

        if (dataOrder.reservasi && dataOrder.reservasi.half_payment){ 
            let discount_dp = gross_amount * (50 / 100);

            gross_amount -= discount_dp;

            item_details.push({
                id: `DP-50%`,
                price: -discount_dp,
                quantity: 1,
                name: `DP-50%`
            });

            id_order = `${id_order}-${new Date().getTime()}`;
        }

        item_details.push({
            id: "admin_fee",
            price: paymentMethod === "bank_transfer" ? 4000 : Math.ceil(gross_amount * 0.007),
            quantity: 1,
            name: paymentMethod === "bank_transfer" ? "Admin Bank Transfer" : "Admin Qris"
        });

        gross_amount += paymentMethod === "bank_transfer" ? 4000 : Math.ceil(gross_amount * 0.007);

        console.log(id_order)

        const midTransPayload = {
            transaction_details: {
                order_id: id_order,
                gross_amount
            },
            item_details: item_details,
            customer_details: {
                first_name: dataOrder.order_by,
                phone: dataOrder.phone_number,
            },
            enabled_payments: [
                paymentMethod
            ],
            expiry: {
                start_time: new Date().toISOString().replace('T', ' ').split('.')[0] + ' +0000',
                unit: "minutes",
                duration: 1
            },
            metadata: {
                "order_id": dataOrder.id
            }
        }
        
        // console.log(midTransPayload)

        const response = await fetch(`${process.env.MIDTRANS_APP_URL}/snap/v1/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Basic ${authString}`,
            },
            body: JSON.stringify(midTransPayload)
        })  

        const data = await response.json();

        console.log(data, response.status, id_order)

        if (response.status !== 201){
            throw Error("Failed to create transaction");
        }

        return camelize(data);
    }


    async trxNotif(data){
        // let order_id = data.metadata.order_id;
        // console.log(data)   

        const hash = crypto.createHash('sha512').update(`${data.order_id}${data.status_code}${data.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`).digest('hex');

        if(data.signature_key !== hash || !data.metadata.order_id){
            throw BaseError.badRequest("Invalid signature key");
        }

        const order = await this.OrderRepository.getByIdWithRelation(data.metadata.order_id);

        if (!order || order.deleted_at){
            throw BaseError.badRequest("Order not found");
        }

        let isTransactionExist = await this.TransactionRepository.getTransactionByIdTrx(data.transaction_id);

        if (!isTransactionExist){
            let transactionData = {
                trxId: data.transaction_id,
                orderId: order.id,
                gross_amount: parseFloat(data.gross_amount),
                payment_method: data.payment_type,
                admin_fee: data.payment_type === "bank_transfer" ? 4000 : Math.ceil(parseFloat(data.gross_amount) - (parseFloat(data.gross_amount) / (1 + 0.007))),
                status: data.transaction_status
            }

            const transaction = await this.createTransaction(transactionData);
            console.log("New Transaction Created", transaction);

            // return transaction;
        } else {
            const transaction = await this.updateStatusTransaction(isTransactionExist.id, data.transaction_status);
            console.log("Transaction Updated", transaction);
        }

        const params = {
            where: {
                order_id: order.id,
                status: { in: ["settlement", "capture"] }
            }
        }
        const successTransactions = await this.TransactionRepository.get(params);

        // console.log(params, successTransactions)

        if ((data.transaction_status === "settlement" || data.transaction_status === "capture") && data.fraud_status === "accept"){
            if (order.status === "MENUNGGU_PEMBAYARAN"){
                if (order.reservasi_id){
                    if (order.reservasi.half_payment){
                        await this.OrderRepository.update(order.id, { status: "MENUNGGU_PELUNASAN" });
                        console.log("Reservasi Status Updated to MENUNGGU_PELUNASAN");
                    } else {
                        await this.OrderRepository.update(order.id, { status: "BELUM_DIBUAT" });
                        console.log("Reservasi Status Updated to BELUM_DIBUAT");
                    }
                } else {
                    await this.OrderRepository.update(order.id, { status: "BELUM_DIBUAT" });
                    console.log("Order Status Updated to BELUM_DIBUAT");
                }
                
            } else if (order.status === "MENUNGGU_PELUNASAN"){
                this.OrderRepository.update(order.id, { status: "BELUM_DIBUAT" });
                console.log("Reservasi Status Updated to BELUM_DIBUAT");
            }
            
        } else if (data.transaction_status === "expire"){
            // Jika Order Terdapat Reservasi dan belum ada transaksi sama sekali maka akan soft delete reservasi dan relasinya tsb
            if (order.reservasi_id && successTransactions.total == 0){
                for (const orderDetail of order.order_detail){
                    await this.MenuRepository.update(orderDetail.menu_id, { qty: { increment: orderDetail.qty }});
                }

                await this.ReservasiRepository.deleteWithRelation(order.reservasi_id);
            // Jika Order tidak terdapat reservasi dan belum ada transaksi sama sekali maka akan soft delete order dan relasinya tsb
            } else if (!order.reservasi_id && successTransactions.total == 0) {
                for (const orderDetail of order.order_detail){
                    await this.MenuRepository.update(orderDetail.menu_id, { qty: { increment: orderDetail.qty }});
                }

                await this.OrderRepository.deleteWithRelation(order.id);
            }
        }
        
        return data;
    }
}

export default new TransactionServices();