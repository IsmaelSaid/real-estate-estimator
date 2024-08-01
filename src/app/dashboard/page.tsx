import AppBarComponent from "@/app/components/AppBarComponent";
import {DashboardComponent} from "@/app/components/dashboard/DashboardComponent";
export default async function Dashboard() {

    return (
        <div className={'h-full'}>
            <AppBarComponent/>
            <DashboardComponent/>
        </div>
    );
}