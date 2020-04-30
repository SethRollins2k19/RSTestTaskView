import React, {useState} from "react";
import style from "./TableCRM.module.css";
import axios from "axios";


const getContacts = (query = "", setContacts) => {
    axios.post('http://localhost:9000/getContact',{query})
        .then(res => {
            setContacts(res.data);
        })
};

//Main window of CRM contacts
class TableContactCRM  extends React.Component {
    //init handlers for state
    constructor(props){
        super(props);
        this.handleContacts = this.handleContacts.bind(this);
        this.handleQuery = this.handleQuery.bind(this);
        this.handleStartFetch = this.handleStartFetch.bind(this);
    }
    //init state for input, contacts and fetching
    state = {
        query: "",
        contacts: [],
        isFetched: false,
        isFetching: true,
    };
    //change query for search
    handleQuery(query){
        this.setState(prevState => ({...prevState,query: query}))
    }
    //start fetching
    handleStartFetch(){
        this.setState(prevState => ({...prevState, isFetching: true}))
    }
    //end fetching
    handleContacts(contacts){
        this.setState(prevState => ({...prevState, isFetching: false, contacts: contacts}))
    }
    //first get all contacts
    componentDidMount() {
        const setContacts = this.handleContacts;
        const query = this.state.query;

        getContacts(query,setContacts);
    }

    render() {
        const setContacts = this.handleContacts;
        const setQuery = this.handleQuery;
        const startFetch = this.handleStartFetch;
        const query = this.state.query;
        const contacts = this.state.contacts;
        const isFetching = this.state.isFetching;

        return (
            <div className={style.TableCRM}>
            <header className={style.TableCRMHeader}>
                <div className={style.TableCRMTitle}>
                    Test task for RocketSales
                </div>
                <form className={`${style.TableCRMFilter} ${query.length < 3 && query.length !== 0 ?style.TableCRMFilterLower: ""}`} onSubmit={async (e)=>{
                    e.preventDefault();
                    if(query.length > 2){
                        await startFetch();
                        getContacts(query,setContacts);
                    }
                }}>
                    <input type="text"
                           name="filterQuery"
                           placeholder="Поиск контактов"
                           value={query}
                           onChange={event => setQuery(event.target.value)}
                    />
                    <button type="submit" className={style.TableCRMFilterSubmit}>Search</button>
                </form>
            </header>
            <main className={style.TableCRMInner}>
                <header className={style.TableCRMInnerHeader}>
                    <div className={style.TableCRMCell}><span>Полное имя</span></div>
                    <div className={style.TableCRMCell}><span>Номер телефона</span></div>
                    <div className={style.TableCRMCell}><span>Email</span></div>
                </header>

                {contacts.length === 0 || isFetching? <Loader isFetching={isFetching}/>
                :
                    contacts.map((customer,index) => {
                    return (<TableCRMRow key={index} {...customer}/>)
                })}
            </main>
        </div>)
    }
}


//Row of CRMContacts
function TableCRMRow ({name ,tags , phone,email ,leads }) {
    const [isOpen, setIsOpen] = useState(false);

    return (<div className={style.TableCRMItemWrapper}>
        <div className={style.TableCRMItem}>
            <div className={style.TableCRMCell}>
                {leads.length?
                <span className={`${style.TableCRMOpen} ${isOpen?style.TableCRMOpenActive:""}`}
                      onClick={()=>setIsOpen(!isOpen)}>{isOpen?"-":"+"}
                </span>:""}
                <span>{name} </span>
                {tags.length?tags.map((item,index) => (<Tags key={index} tagName={item.name}/>)):""}
            </div>
            <div className={style.TableCRMCell}><span>{phone}</span></div>
            <div className={style.TableCRMCell}><span>{email}</span></div>
        </div>

        <div className={`${style.TableCRMOrderList} ${isOpen?style.TableCRMOrderListActive : ""}`}>
            {leads.map((lead,index)=>{
                return (<Order key={index} {...lead}/>)
            })}
        </div>
    </div>)
}
//Tags for costumers
function Tags({tagName}){
    return(<span className={style.Tag}>
        {tagName}
    </span>)
}
//Order for costumers
function Order({name, pipelines, sale , status}){
    return(<div className={style.TableCRMOrder}>
        <div>{name}</div>
        <div className={style.TableCRMOrderFunnel}>
            {pipelines.name}: <span className={style.funnelDecoration}>{pipelines.statuses[status].name}</span>
        </div>
        <div>{sale}₽</div>
    </div>)
}
//loader while fetching
function Loader({isFetching}) {
    return (<div className={style.SpinnerWrapper}>
        {isFetching?
            <div className={style.loader}>
            </div>
            :
            <Hero title="Контакт с таким фильтром не найдем"
                  subTitle="Попробуйте изменить параметры поиска или проверьте правильность написания"
            />
        }
    </div>)
}

// hero message
function Hero({title,subTitle}){
    return (<div>
        <h1>{title}</h1>
        <h3>{subTitle}</h3>
    </div>)
}

export {
    TableContactCRM
}

