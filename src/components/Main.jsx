import { useState, useEffect } from "react"

export default function Main() {

    const [meme, setMeme] = useState({
        topText: "",
        bottomText: "",
        imgUrl: "http://i.imgflip.com/1bij.jpg"
    })

    const [allMeme, setallMeme] = useState([]);

    useEffect(()=>{
        fetch("https://api.imgflip.com/get_memes")
            .then((res)=> res.json())
            .then((data)=> setallMeme(data.data.memes))
    }, [])

    function handleChange(event){
        const {value, name} = event.currentTarget;
        setMeme((prev)=>(
            {...prev, [name]:value}
        ))
    }

    function getNewMeme(){
        const randomNum = Math.floor(Math.random() * allMeme.length);
        const newMeme = allMeme[randomNum].url;
        setMeme((prev)=>({...prev, imgUrl:newMeme}))
    }

    return (
        <main>
            <div className="form">
                <label>Top Text
                    <input
                        type="text"
                        placeholder="One does not simply"
                        name="topText"
                        value={meme.topText}
                        onChange={handleChange}
                    />
                </label>

                <label>Bottom Text
                    <input
                        type="text"
                        placeholder="Walk into Mordor"
                        name="bottomText"
                        value={meme.bottomText}
                        onChange={handleChange}
                    />
                </label>
                <button onClick={getNewMeme}>Get a new meme image 🖼</button>
            </div>
            <div className="meme">
                <img src={meme.imgUrl}/>
                <span className="top">{meme.topText}</span>
                <span className="bottom">{meme.bottomText}</span>
            </div>
        </main>
    )
}