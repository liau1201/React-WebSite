import openai from "@/services/openai";
import db from "@/services/db";

export async function GET() {
    const docList = await db.collection("image-ai").orderBy("createdAt","desc").get();
    const cardList = [];
    docList.forEach(doc=>{
        cardList.push(doc.data);
    })
    return cardList;
}


export async function POST(req) {
    const body = await req.json();
    console.log("body:", body);
    // 文件連結: https://platform.openai.com/docs/guides/images/usage
     const prompt = `使用照片寫真風格生成關鍵字=[${body.userInput}]的圖像`;
    // TODO: 透過dall-e-3模型讓AI產生圖片
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
      });
    const imageURL = response.data[0].url;

    const card = {
        imageURL,
        prompt,
        createdAt:new Date().getTime(),
    }
    console.log("card:",card);
    db.collection("image-ai").add(card)
    // return Response.json({ message: "Success" });
    return Response.json(card);
}