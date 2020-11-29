const { sequelize, Sequelize, User, Product, Order } = require('../models')
const { ProductSearchBySellerId } = require('./productController')
const Op = Sequelize.Op

exports.OrderCreate = async (req, res) => {
    let data = {
        sellerId: null,
        customerId: req.decoded.id,
        productId: req.body.productId,
        address:req.body.address,
        status: false
    }
    let product = null
    try {
        product = await Product.findByPk(data.productId)
        if (!product) {
            return res.status(404).json( {message: 'Product Not Found'})
        }
    } catch (err) {
        return res.status(500).json( {message: err.message})
    }
    data.sellerId = product.sellerId
    try {
        const order = await Order.create(data)
        return res.status(201).json(order)
    } catch (err) {
        return res.status(500).json(err)
    }
}

exports.OrderInfo = async (req, res) => {
    const userId = req.params.userId
    const orderId = req.params.orderId
    

    let result = null
    
    const query = `select DISTINCT o.id, o.status, o.address, p.name, p.price, p.tag, ifnull(p.deletedAt, true ) as productAlive, ifnull(o.deletedAt, true) as orederAlive
                   from Orders o, Products p
                   where o.customerId = '${userId}' and o.productId = p.id and o.id = '${orderId}'` 
    
    if (req.decoded.id != userId) {
        return res.status(401).json({message:'UnAuthorized Access'})
    }
    try {
        result = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })
        data = {
            count: result.length,
            data: result
        }
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

exports.OrderDelete = async (req, res) => {
    const userId = req.params.userId
    const id = req.params.orderId
    let reuslt = null
    let order = null
    let data = null
    if (req.decoded.id != userId) {
        return res.status(401).json({message:'UnAuthorized Access'})
    }
    try {
        order = await Order.findAndCountAll({
            where: {
                id,
                customerId: userId
            }
        })
        if (order.count == 0) {
            return res.status(404).json({message:'Order Not Found'})
        }
        reuslt = await Order.destroy({
            where: {id}
        }) 
        data = order.rows[0].dataValues
        data.deleted = true
        return res.status(201).json(data)
    } catch(error){
        return res.status(500).json(error.message)
    }
}

exports.OrderList = async (req, res) => {
    const userId = req.params.userId

    let result = null
    
    const query = `select DISTINCT o.id, o.status, o.address, p.name, p.price, p.tag, p.deletedAt as productDeletedAt, o.deletedAt as orederDeletedAt
                   from Orders o, Products p
                   where o.customerId = '${userId}' and o.productId = p.id` 
    
    if (req.decoded.id != userId) {
        return res.status(401).json({message:'UnAuthorized Access'})
    }
    try {
        result = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })
        data = {
            count: result.length,
            data: result
        }
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

exports.OrderSearchByStatus = async (req, res) => {
    const userId = req.params.userId
    const status = req.params.status
    let result = null
    
    const query = `select DISTINCT o.id, o.status, o.address, p.name, p.price, p.tag, p.deletedAt as productDeletedAt, o.deletedAt as orederDeletedAt
                   from Orders o, Products p
                   where o.customerId = '${userId}' and o.status = ${status} and o.productId = p.id` 
    
    if (req.decoded.id != userId) {
        return res.status(401).json({message:'UnAuthorized Access'})
    }
    try {
        result = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })
        data = {
            count: result.length,
            data: result
        }
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }

}

exports.OrderSearchByTags = async (req, res) => {
    const userId = req.params.userId
    const tag = req.params.tag
    let result = null
    
    const query = `select DISTINCT o.id, o.status, o.address, p.name, p.price, p.tag, p.deletedAt as productDeletedAt, o.deletedAt as orederDeletedAt
                   from Orders o, Products p
                   where o.customerId = '${userId}' and p.tag Like '%${tag}%' and o.productId = p.id` 
    
    if (req.decoded.id != userId) {
        return res.status(401).json({message:'UnAuthorized Access'})
    }
    try {
        result = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })
        data = {
            count: result.length,
            data: result
        }
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

exports.OrderSearchByName = async (req, res) => {
    const userId = req.params.userId
    const name = req.params.name
    let result = null
    
    const query = `select DISTINCT o.id, o.status, o.address, p.name, p.price, p.tag, p.deletedAt as productDeletedAt, o.deletedAt as orederDeletedAt
                   from Orders o, Products p
                   where o.customerId = '${userId}' and p.name Like '%${name}%' and o.productId = p.id` 
    
    if (req.decoded.id != userId) {
        return res.status(401).json({message:'UnAuthorized Access'})
    }
    try {
        result = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })
        data = {
            count: result.length,
            data: result
        }
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}



exports.SellerOrderInfo = async (req, res) => {
    const userId = req.params.userId
    const orderId = req.params.orderId
    

    let result = null
    
    const query = `select DISTINCT o.id, o.status, o.address, p.name, p.price, p.tag, ifnull(p.deletedAt, true ) as productAlive, ifnull(o.deletedAt, true) as orederAlive
                   from Orders o, Products p
                   where o.sellerId = '${userId}' and o.productId = p.id and o.id = '${orderId}'` 
    
    if (req.decoded.id != userId) {
        return res.status(401).json({message:'UnAuthorized Access'})
    }
    try {
        result = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })
        data = {
            count: result.length,
            data: result
        }
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

exports.SellerOrderDelete = async (req, res) => {
    const userId = req.params.userId
    const id = req.params.orderId

    let reuslt = null
    let order = null
    let data = null
    if (req.decoded.id != userId) {
        return res.status(401).json({message:'UnAuthorized Access'})
    }
    try {
        order = await Order.findAndCountAll({
            where: {
                id,
                sellerId: userId
            }
        })
        if (order.count == 0) {
            return res.status(404).json({message:'Order Not Found'})
        }
        reuslt = await Order.destroy({
            where: {id}
        }) 
        data = order.rows[0].dataValues
        data.deleted = true
        return res.status(201).json(data)
    } catch(error){
        return res.status(500).json(error.message)
    }
}

exports.SellerOrderList =  async (req, res) => {
    const userId = req.params.userId

    let result = null
    
    const query = `select DISTINCT o.id, o.status, o.address, p.name, p.price, p.tag, p.deletedAt as productDeletedAt, o.deletedAt as orederDeletedAt
                   from Orders o, Products p
                   where o.sellerId = '${userId}' and o.productId = p.id` 
    
    if (req.decoded.id != userId) {
        return res.status(401).json({message:'UnAuthorized Access'})
    }
    try {
        result = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })
        data = {
            count: result.length,
            data: result
        }
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

exports.SellerOrderSearchByStatus = async (req, res) => {
    const userId = req.params.userId
    const status = req.params.status
    let result = null
    
    const query = `select DISTINCT o.id, o.status, o.address, p.name, p.price, p.tag, p.deletedAt as productDeletedAt, o.deletedAt as orederDeletedAt
                   from Orders o, Products p
                   where o.sellerId = '${userId}' and  o.status = ${status} and o.productId = p.id` 
    
    if (req.decoded.id != userId) {
        return res.status(401).json({message:'UnAuthorized Access'})
    }
    try {
        result = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })
        data = {
            count: result.length,
            data: result
        }
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }

}

exports.SellerOrderSearchByTags = async (req, res) => {
    const userId = req.params.userId
    const tag = req.params.tag
    let result = null
    
    const query = `select DISTINCT o.id, o.status, o.address, p.name, p.price, p.tag, p.deletedAt as productDeletedAt, o.deletedAt as orederDeletedAt
                   from Orders o, Products p
                   where o.sellerId = '${userId}' and p.tag Like '%${tag}%' and o.productId = p.id` 
    
    if (req.decoded.id != userId) {
        return res.status(401).json({message:'UnAuthorized Access'})
    }
    try {
        result = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })
        data = {
            count: result.length,
            data: result
        }
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

exports.SellerOrderSearchByName = async (req, res) => {
    const userId = req.params.userId
    const name = req.params.name
    let result = null
    
    const query = `select DISTINCT o.id, o.status, o.address, p.name, p.price, p.tag, p.deletedAt as productDeletedAt, o.deletedAt as orederDeletedAt
                   from Orders o, Products p
                   where o.sellerId = '${userId}' and p.name Like '%${name}%' and o.productId = p.id` 
    
    if (req.decoded.id != userId) {
        return res.status(401).json({message:'UnAuthorized Access'})
    }
    try {
        result = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        })
        data = {
            count: result.length,
            data: result
        }
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

exports.SellerOrderStatusCompleted = async (req, res) => {
    const userId = req.params.userId
    const id = req.params.orderId
    const status = req.params.status
    let order = null
    if (req.decoded.id != userId) {
        return res.status(401).json({message:'UnAuthorized Access'})
    }
    try {
        order = await Order.findOne({
            where: {
                id,
                sellerId: userId
            }
        })
        if (!order) {
            return res.status(404).json( {message:'Order Not Found'} )
        }
        await await order.update({
            status
        })
        return res.status(201).json(order)
    } catch (err) {
        return res.status(500).json(err.message)
    }
}