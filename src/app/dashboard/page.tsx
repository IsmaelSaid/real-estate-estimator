import AppBarComponent from "@/app/components/AppBarComponent";
import {Mutation} from "@prisma/client";
import {DashboardComponent} from "@/app/components/DashboardComponent";
export default async function Dashboard() {
    const ORIGIN = process.env.ORIGIN
    const res = await fetch(`${ORIGIN}/api/mutations`, {
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
    return (
        <div className={'h-full'}>
            <AppBarComponent/>
            <DashboardComponent data={data}/>
        </div>
    );
}