'use client'
import {DashboardNavigation} from "@/app/components/dashboard/DashboardNavigation";
import {Mutation} from "@prisma/client";
import {DisplayMutations} from "@/app/components/dashboard/DisplayMutations";
import {useContext, useEffect, useState} from "react";
import {Charts} from "@/app/components/dashboard/Charts";
import _ from "lodash";
import {LinearProgress} from "@mui/material";
/**
 * DashboardComponent
 *
 * @param {Mutation[]} data - An array of Mutation objects to be displayed in the 'Raw data' tab.
 */
export function DashboardComponent() {

    const [data, setData] = useState([] as Mutation[])
    const [activeTab, setActiveTab] = useState('raw_data')
    const [isLoading, setIsLoading] = useState(true)


    const fetchData = async () => {
        setIsLoading(true)
        const res = await fetch(`api/mutations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: "no-store"
        });

        if (!res.ok) {
            throw new Error('Failed to fetch mutations');
        }
        const data: Mutation[] = await res.json();
        console.info(data)
        const sortedData = _.chain(data).uniqBy('id_mutation').sortBy('valeur_fonciere').value()
        setData(sortedData)
        setIsLoading(false)
    }


    const menu = [
        {
            id: 'raw_data',
            label: 'Raw data',
            component: <DisplayMutations data={data}/>
        },
        {
            id: 'charts',
            label: 'Chart',
            component: <Charts data={data}/>
        },
    ]

    useEffect(() => {
        fetchData()
    }, []);
    return <div className={'w-full h-full white pt-20 pl-64 mx-auto'}>
        <DashboardNavigation activeTab={activeTab} onTabChange={(tab: string) => setActiveTab(tab)}/>
        <div className={'Container mx-3 h-full'}>
            {isLoading ?
                <div className={'flex h-full justify-center items-center'}><LinearProgress className={'w-1/3'}/>
                </div> : menu.find((item) => item.id === activeTab)?.component}
        </div>
    </div>
}