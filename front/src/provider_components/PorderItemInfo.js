import React, {Component} from 'react';
import './PorderItemInfo.css';
import {Link} from 'react-router-dom';
import axios from 'axios'

class PorderItemInfo extends Component{
    constructor(props){
        super(props);
        this.state = {
            id : props.match.params.id,
        }
        this._getInfo()
    }

    handleCancelorder = async() =>{
        await axios.put(`/seller/${this.props.userId}/orders/${this.props.match.params.id}`,{},{
            headers: {
                Authorization: this.props.token
        }});
        this.props.getAll()
    }

    handleCompleteorder = async() =>{
        await axios.put(`/seller/${this.props.userId}/orders/${this.props.match.params.id}/status/true`,{},{
            headers: {
                Authorization: this.props.token
        }});
        this.props.getAll()
    }

    _getInfo = async() =>{
        const res = await axios.get(`/seller/${this.props.userId}/orders/${this.props.match.params.id}`,{
            headers: {
                Authorization: this.props.token
        }});
        console.log(res.data)
        this.setState({
            id: this.state.id,
            customerId:res.data.customerId||"test",
            name: res.data.name,
            discription:res.data.content,
            tag: res.data.tag,
            price:res.data.price,
            registrationDate:res.data.productCreatedAt,
            photo: (res.data.image === null ? null :'http://localhost:3000/'+res.data.image.url),
            orderdate : res.data.orderCreatedAt,
            cancel : (res.data.orederDeletedAt==null && res.data.productDeletedAt==null ? false : true),
            completed : (res.data.status === 1 ? true : false),
            address : res.data.address,
        })
    }


    render(){
        const{id, customerId, name, discription, tag, price, registrationDate, photo,orderdate,cancel,completed,address} = this.state;

        return(
            <div className={`info-wrapper ${ cancel ? 'canceledbox' : '' } ${ completed ? 'completedbox' : '' }`}>
                <div className={`info-box ${ cancel ? 'canceledbox' : '' } ${ completed ? 'completedbox' : '' }`}>
                    <div className = "info-photo">
                        <img src={photo}/>
                    </div>
                    <div className = "Right">
                        <div className = "Info">
                            <div className = "info-item-name">[{name}]{cancel ? '-?????????' : ''} {completed ? '-?????????' : ''}</div>
                            <div className = "info-price"><span className="tag-pod">price</span> {price} won</div>
                            <div className = "order-info-discription">
                                <div className = "order-info-header">????????????</div>
                                <div className = "order-info-discription-wrapper">{discription}</div>
                                <div className="tag-wrapper"><div className = "info-tag"># {tag}</div></div>
                                <div className = "provide">
                                    <div className = "providerId"> <span className="tag-pod">?????????</span> {customerId} </div>
                                    <div className = "registrationDate"><span className="tag-pod">?????????</span> {registrationDate}</div>
                                </div>
                            </div>
                            <div className = "order-info">
                                <div className = "order-info-header">????????????</div>
                                <div className = "purchaseDate"><span className="tag-pod">?????????</span> {orderdate}</div>
                                <div className = "purchaseDate"><span className="tag-pod">??????</span> {address}</div>
                            </div>
                        </div>
                        <div className={`purchase-button-pod ${ cancel ? 'completed' : '' } ${ completed ? 'completed' : '' }`}>
                            <Link to ='/provider/orders'>
                            <div className = 'purchase-button-2' onClick={this.handleCompleteorder}>
                                ????????????
                            </div></Link>
                            <Link to ='/provider/orders'>
                            <div className = 'purchase-button-2' onClick={this.handleCancelorder}>
                                ????????????
                            </div></Link>
                        </div>


                    </div>
                </div>
            </div>
        )
    }
}

export default PorderItemInfo;