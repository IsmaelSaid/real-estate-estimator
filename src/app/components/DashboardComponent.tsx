'use client'
import {DashboardNavigation} from "@/app/components/DashboardNavigation";
import {Mutation} from "@prisma/client";
import {DisplayMutations} from "@/app/components/DisplayMutations";
import {useState} from "react";

/**
 * DashboardComponent
 *
 * @param {Mutation[]} data - An array of Mutation objects to be displayed in the 'Raw data' tab.
 */
export function DashboardComponent({data}: { data: Mutation[] }) {
    const [activeTab, setActiveTab] = useState('raw_data')
    const menu = [
        {
            id: 'raw_data',
            label: 'Raw data',
            component: <DisplayMutations data={data}/>
        },
        {
            id: 'charts',
            label: 'Chart',
            component: <p>placeholder charts</p>
        },
    ]
    return <div className={'w-full h-full bg-white pt-20 pl-64 mx-auto'}>
        <DashboardNavigation activeTab={activeTab} onTabChange={(tab: string) => setActiveTab(tab)}/>
        <div className={'Container mx-3 h-full'}>
            {menu.find((item) => item.id === activeTab)?.component}
        </div>
    </div>
}