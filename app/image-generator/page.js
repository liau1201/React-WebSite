"use client";

import { useState,useEffect } from "react";
import axios from "axios";
import { faImage } from "@fortawesome/free-solid-svg-icons"
import CurrentFileIndicator from "@/components/CurrentFileIndicator";
import PageHeader from "@/components/PageHeader";
import GeneratorButton from "@/components/GenerateButton";
import ImageGenCard from "@/components/ImageGenCard";
import ImageGenPlaceholder from "@/components/ImageGenPlaceholder";

export default function ImgGen() {
    const [userInput, setUserInput] = useState("");
    const [cardList, setCardList] = useState([]);
    // 是否在等待回應
    const [isWaiting, setIsWaiting] = useState(false);

    useEffect(()=>{
        axios.get("/api/image-ai")
            .then(res=>{
                setCardList(res.data);
            })
            .catch(err=>{
                alert(err);
            })
            .finally(()=>{
                
            })
    },[]);

    function submitHandler(e) {
        e.preventDefault();
        console.log("User Input: ", userInput);
        const body = { userInput };
        console.log("body:", body);
        // TODO: 將body POST到 /api/image-ai { userInput: "" }
        //設定等待,清空使用者輸入
        setUserInput("");
        setIsWaiting(true);
        axios.post("/api/image-ai",body)
            .then(res=>{
                const card = res.data;
                setCardList([card,...cardList]);
                console.log("Return:",card)
            })
            .catch(err=>{
                
                console.log(err);
                alert("發生錯誤，請稍後再嘗試");
            })
            //設定 callback, 會按照狀況執行callback
            .finally(function finalLogs(){
                console.log("Finally");
                setIsWaiting(false);
            });
            /**
            .finally(() => {
                setIsWaiting(false);
                console.log("finally")
            });
             */
            //未設定 callback, 會直接執行(在其他 callback 執行之前)
            //.finally(console.log("final"));

 

            
            



    }

    return (
        <>
            <CurrentFileIndicator filePath="/app/image-generator/page.js" />
            <PageHeader title="AI Image Generator" icon={faImage} />
            <section>
                <div className="container mx-auto">
                    <form onSubmit={submitHandler}>
                        <div className="flex">
                            <div className="w-4/5 px-2">
                                <input
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    type="text"
                                    className="border-2 focus:border-pink-500 w-full block p-3 rounded-lg"
                                    placeholder="Enter a word or phrase"
                                    required
                                />
                            </div>
                            <div className="w-1/5 px-2">
                                <GeneratorButton />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            <section>
                <div className="container mx-auto">
                    {/* TODO: 顯示AI輸出結果 */}
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
                      {isWaiting?<ImageGenPlaceholder />:null}
                      {cardList.map(card=>{
                        const{imageURL, prompt,createdAt} = card;
                        return <ImageGenCard 
                        imageURL={imageURL}
                        prompt={prompt}
                        key = {createdAt}
                        />
                      })}
                      <ImageGenPlaceholder />
                    </div>
                </div>
            </section>
        </>
    )
}