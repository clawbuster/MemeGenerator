import { useState, useEffect, useRef } from "react"

export default function Main() {
    const [meme, setMeme] = useState({
        topText: "",
        bottomText: "",
        imgUrl: "http://i.imgflip.com/1bij.jpg"
    })
    const [allMeme, setallMeme] = useState([]);
    const memeRef = useRef(null);
    
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
    
    async function downloadMeme() {
        const memeElement = memeRef.current;
        const img = memeElement.querySelector('img');
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        const image = new Image();
        image.crossOrigin = "anonymous";
        
        image.onload = function() {
            ctx.drawImage(image, 0, 0);
            
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = canvas.width / 150;
            ctx.textAlign = 'center';
            ctx.font = `bold ${canvas.width / 10}px Impact, sans-serif`;
            ctx.textBaseline = 'top';
            
            const maxWidth = canvas.width * 0.9;
            const lineHeight = canvas.width / 8;
            
            if (meme.topText) {
                const topLines = wrapText(ctx, meme.topText.toUpperCase(), maxWidth);
                topLines.forEach((line, i) => {
                    const y = 20 + (i * lineHeight);
                    ctx.strokeText(line, canvas.width / 2, y);
                    ctx.fillText(line, canvas.width / 2, y);
                });
            }
            
            if (meme.bottomText) {
                const bottomLines = wrapText(ctx, meme.bottomText.toUpperCase(), maxWidth);
                ctx.textBaseline = 'bottom';
                bottomLines.reverse().forEach((line, i) => {
                    const y = canvas.height - 20 - (i * lineHeight);
                    ctx.strokeText(line, canvas.width / 2, y);
                    ctx.fillText(line, canvas.width / 2, y);
                });
            }
            
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'meme.png';
                a.click();
                URL.revokeObjectURL(url);
            });
        };
        
        image.src = meme.imgUrl;
    }
    
    function wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
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
            <div className="meme-container">
                <button className="download-btn" onClick={downloadMeme} title="Download meme">
                    ⬇️ Download
                </button>
                <div className="meme" ref={memeRef}>
                    <img src={meme.imgUrl} alt="Meme"/>
                    <span className="top">{meme.topText}</span>
                    <span className="bottom">{meme.bottomText}</span>
                </div>
            </div>
        </main>
    )
}