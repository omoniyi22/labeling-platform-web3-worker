"use client"
import { BACKEND_URL } from "@/utils"
import axios from "axios"
import { useEffect, useState } from "react"
import Loader from "./Loader/Loader";
import { useBalance } from "@/utils/balanceContext";
import { toast } from "react-toastify";


interface Task {
    "id": number,
    "amount": number,
    "title": string,
    "options": {
        id: number;
        image_url: string;
        task_id: number
    }[]
}

export const NextTask = () => {
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const { balance, setBalance } = useBalance()
    const [end, setEnd] = useState("")
    async function getCurrentTask() {
        try {
            setEnd("")
            setLoading(true)
            const response = await axios.get(`${BACKEND_URL}/v1/worker/nextTask`, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            })
            console.log({ task: response.data.task })
            setCurrentTask(response.data.task);
            if (!response.data.task) {
                toast(response.data.message)
                setEnd(response.data.message)
            } else if (currentTask == null) {
                toast(response.data.message)
                setEnd(response.data.message)
            }
            console.log({ task: currentTask })
        } catch (err) {
            toast("No task found, Try again")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCurrentTask()
    }, [])
    async function submitFunc(option: {
        id: number;
        image_url: string;
        task_id: number;
    }) {
        try {
            setLoading(true)
            const response = await axios.post(`${BACKEND_URL}/v1/worker/submission`, {
                taskId: `${currentTask?.id}`,
                selection: `${option?.id}`
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            })
            const nextTask = await response.data.nextTask;
            const available_balance = await response.data.balance;
            setBalance(available_balance)
            setCurrentTask(nextTask)
            toast("You have successfully submitted.")
            console.log({ nextTask })
        } catch (error) {
            setCurrentTask(null)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <Loader isVisible={loading} />
    }
    if (!loading && !currentTask?.title)
        return (
            <div className="text-center justify-center mt-10">
                {end ? `${"No more task left to review"}.` : "Not Task Found"}   <div></div>
                <button onClick={getCurrentTask} className='mt-4 small text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4
        focus:ring-gray-300 font-medium rounded-full ml-1 text-xs px-2.5 py-1.5 me-2 mb-2 dark:bg-gray-800
        dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'> {end ? "Check Again" : "Try Again"}</button>
            </div>
        )
    else {
        return (
            <>
                <div className="text-2xl pt-10 font-bold flex justify-center ">
                    <span className=""> Task No</span>: <span className="ml-2"><span> </span > {currentTask?.id}</span>
                </div>
                <div>
                    <div className="text-2xl pt-10 flex  mb-1 justify-center">
                        {currentTask?.title}
                    </div>
                    <div className="flex flex-wrap gap-3 max-w-fit mb-2 p-6 rounded-sm justify-center mx-auto">
                        {currentTask?.options.map((option) =>
                            <Option imageUrl={option.image_url}
                                onSelect={() => submitFunc(option)} key={option.id} />)}
                    </div>
                </div>
            </>
        )
    }
}


function Option({ imageUrl, key, onSelect }: {
    imageUrl: string;
    key: number;
    onSelect: () => void
}) {
    return (
        <>
            <div className="relative group  pb-0 bg-gray-700 cursor-pointer shadow-xl border-gray-700 border max-w-fit  overflow-hidden rounded-lg">
                <img src={imageUrl} className="object-cover h-32 w-44  rounded-md p-1 border my-5  mx-8 mb-1  " />
                <div onClick={onSelect} className="flex justify-center mt-3 border-t white bg-white border-gray-700 py-1 shadow-lg cursor-pointer">
                    select
                </div>
            </div>
        </>
    )
}