"use client"
import { useState } from "react";
import { BACKEND_URL, CLOUDFRONT_URL } from "@/utils";
import axios from "axios"

export function UploadImage(
    { onImageAdded, image }: {
        onImageAdded: (image: string) => void;
        image?: string;
    }) {

    // apas

    const [uploading, setUploading] = useState(false);
    async function onFIleSelect(e: any) {
        setUploading(true);
        try {
            const file = e.target.files[0];
            const response = await axios.get(`${BACKEND_URL}/v1/user/presignedUrl`, {
                headers: {
                    'Authorization': localStorage.getItem(`token`)
                }
            })
            const presignedUrl = response.data.presignedUrl;
            const formData = new FormData();
            formData.set("bucket", response.data.fields["bucket"])
            formData.set("X-Amz-Algorithm", response.data.fields["X-Amz-Algorithm"])
            formData.set("X-Amz-Credential", response.data.fields["X-Amz-Credential"])
            formData.set("X-Amz-Date", response.data.fields["X-Amz-Date"])
            formData.set("Key", response.data.fields["Key"])
            formData.set("Policy", response.data.fields["Policy"])
            formData.set("X-Amz-Signature", response.data.fields["X-Amz-Signature"])
            formData.append("file", file)
            const awsResponse = await axios.post(presignedUrl, formData);
            console.log(awsResponse)
            onImageAdded(`${CLOUDFRONT_URL}/${response.data.fields["keys"]}`)
            // const awsResponse = await axios.post(presignedUrl, formData)
        } catch (error) {
            console.log(e)
        }
        setUploading(false)
    }

    if (image) {
        return <img className="p-2 w-96 rounded" src={image} />
    }

    return (
        <div className="w-40 h-40 rounded border text-2xl cursor-pointer">
            <div className="h-full flex justify-center flex-col relative w-full">
                <div className="h-full flex justify-center w-full pt-16 text-4xl">
                    +
                    <input className="w-full h-full"
                        type="file"
                        style={{ opacity: "0", position: "absolute", top: 0, left: 0, bottom: 0, right: 0, width: "100%", height: "100%" }}
                        onSelect={(file) =>
                            console.log({ file })
                        }
                        onChange={(e) => {
                            console.log({ e })
                        }}
                    />
                </div>
            </div>
        </div>
    )
} 