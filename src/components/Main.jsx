import { useState } from "react"

export default function Main() {

    const [meme, setMeme] = useState({
        topText: "",
        bottomText: "",
        imgUrl: "http://i.imgflip.com/1bij.jpg"
    })

    function handleChange(event){
        const {value, name} = event.currentTarget;
        setMeme((prev)=>(
            {...prev, [name]:value}
        ))
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
                <button>Get a new meme image 🖼</button>
            </div>
            <div className="meme">
                <img src={meme.imgUrl}/>
                <span className="top">{meme.topText}</span>
                <span className="bottom">{meme.bottomText}</span>
            </div>
        </main>
    )
}