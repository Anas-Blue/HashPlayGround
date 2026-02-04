const input = document.getElementById("input");
const hashoutput = document.getElementById("hash");

async function generateHash(text){
    const encoder = new TextEncoder()
    const textbuffer = encoder.encode(text)

    const hash = await crypto.subtle.digest("SHA-256", textbuffer)

    const view = Array.from(new Uint8Array(hash))

    const hashhex = view.map(x => x.toString(16).padStart(2, "0")).join("")

    return hashhex
}


input.addEventListener("input", async()=>{
    const text = input.value;

    if(text === ""){
        hashoutput.textContent = "---"
    }else{
        const inputhash = await generateHash(text)
        hashoutput.textContent = inputhash
    }


})