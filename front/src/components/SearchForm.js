import {React,Component} from 'react';
import './SearchForm.css';
import axios from 'axios'

class SearchForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            value : "",
            searchby : this.props.searchby,
            items : []
        }
    }

    handleChange=(e)=>{
        this.setState({value : e.target.value})
    }

    onKeyPress=(e)=>{
        if(e.key === 'Enter'){
            this.onSearch();
        }
    }

    onSearch=()=>{
        if(this.props.from == "product"){
            this.onSearchProduct();
        }
        else if(this.props.from == "order"){
            this.onSearchOrder();
        }
        else if(this.props.from == "Sorder"){
            this.onSellerOrder();
        }
    }

    onSearchProduct=async()=>{
        await this.setState({items:[]})
        const res = await axios.get(`/products/${this.state.searchby}/${this.state.value}`);
        res.data.data.map(
            ({id, name, price, tag, deletedAt,image}) =>(
                this.setState({items : this.state.items.concat({id:id , name:name, price:price, tag:tag, photo : (image === null ? null :'http://localhost:3000/'+image.url), deletedAt:deletedAt})})
            )
        );
        this.props.onSearch(this.state.items);
    }

    //////////////////////////

    onSearchOrder = async() =>{
        await this.setState({items:[]})
        const res = await axios.get(`/user/${this.props.userId}/orders/${this.state.searchby}/${this.state.value}`, 
        {
            headers: {
                Authorization: this.props.token
            }
        });
        await res.data.data.map(
            ({id, name, price, tag, status, productDeletedAt, address, orederDeletedAt,image,sellerId}) =>(
                this.setState({
                    items : this.state.items.concat({
                        id:id , 
                        name:name, 
                        price:price, 
                        tag:tag, 
                        photo : (image === null ? null :'http://localhost:3000/'+image.url), 
                        cancel : (orederDeletedAt==null && productDeletedAt==null ? false : true), 
                        address : address, 
                        completed :(status==1 ? true : false), 
                        provider: sellerId
                    })
                })
            )
        )
        this.props.onSearch(this.state.items)
    }

    //////////////////////////

    onSellerOrder = async() =>{
        await this.setState({items:[]})
        const res = await axios.get(`/seller/${this.props.userId}/orders/${this.state.searchby}/${this.state.value}`, 
        {
            headers: {
                Authorization: this.props.token
            }
        });
        await res.data.data.map(
            ({id, name, price, tag, status, productDeletedAt, address, orederDeletedAt,image,sellerId}) =>(
                this.setState({
                    items : this.state.items.concat({
                        id:id , 
                        name:name, 
                        price:price, 
                        tag:tag, 
                        photo : (image === null ? null :'http://localhost:3000/'+image.url), 
                        cancel : (orederDeletedAt==null && productDeletedAt==null ? false : true), 
                        address : address, 
                        completed :(status==1 ? true : false), 
                        provider: sellerId
                    })
                })
            )
        )
        this.props.onSearch(this.state.items)
    }

    //////////////////////////

    change=(event)=>{
        this.setState({searchby: event.target.value});
    }

    render(){
        return(
            <div className="form">
                <select className="Searchby" onChange={this.change} value={this.state.searchby}>
                  <option value="name">??????</option>
                  <option value="tag">??????</option>
                  {this.props.from == "product" ? <option value="provider">?????????</option> : ''}
                  {this.props.from == "order"||this.props.from==="Sorder" ? <option value="status">??????</option> : ''}
               </select>
                <input value={this.state.value} onChange={this.handleChange} onKeyPress={this.onKeyPress}/>
                <div className="search-button" onClick={this.onSearch}>
                    ??????
                </div>
            </div>
        )
    }
}
export default SearchForm;