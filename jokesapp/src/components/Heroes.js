import React, {useState, useEffect} from 'react'
import md5 from 'md5'
import {Card, CardDeck, Container, Col, Row} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

const publicK = process.env.REACT_APP_PUBLIC_KEY
const privateK = process.env.REACT_APP_PRIVATE_KEY
const ts = String(Date.now())
const params = {
    "apikey": publicK,
    "ts": ts,
    "hash": md5(ts+privateK+publicK)
}

function Hero(props) {
    const img_url = new URL(props["img"] + "." + props["format"])
    return (
        <Col>
            <Card style={{width:'18rem', marginBottom: "10px"}}>
                <Card.Img variant="top" src={img_url}/>
                <Card.Body>
                    <Card.Title>{props["title"]}</Card.Title>
                    <Card.Text>
                        {props["desc"]}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    )
}

function Heroes() {
    const [header, setHeader] = useState("")
    const [heroes, setHeroes] = useState([])

    useEffect(()=>{
        if(!navigator.onLine){
            if(localStorage.getItem("heroes") === null) {
                setHeader("Loading...")
            } else {
                setHeader("Heroes")
                setHeroes(localStorage.getItem("heroes"));
            }
        } else {
            const url =  new URL("https://gateway.marvel.com:443/v1/public/characters")
            url.search = new URLSearchParams(params).toString()
            fetch(url).then(res=>res.json()).then(res=>{
                setHeader("Heroes")
                setHeroes(Array.from(res["data"]["results"]))
                localStorage.setItem("heroes", Array.from(res["data"]["results"]))
            })
        }
    }, [])

    return (<Container fluid>
        <h1 style={{textAlign: "center"}}>{header}</h1>
        <Row>
            <CardDeck>
                {heroes.map((e, i) => {
                    return (<Hero
                        key={i}
                        img={e["thumbnail"]["path"]}
                        title={e["name"]}
                        desc={e["description"]}
                        format={e["thumbnail"]["extension"]}
                    />)
                })}
            </CardDeck>
        </Row>
    </Container>)
}

export default Heroes