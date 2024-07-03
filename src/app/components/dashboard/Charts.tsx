import _ from "lodash";
import {Mutation} from "@prisma/client";
import {
    isAppartement,
    isVente,
    isHouse,
    calculateSquareMeterValueByYear,
    countPropertyTypesByYear,
    countPropertyTypesByCity
} from "@/app/utils/utils";
import {Bar} from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    LineElement,
    Legend, PointElement,
    LineController, ArcElement,

} from "chart.js";
import {Chart, Line} from "react-chartjs-2";
import {
    BoxPlotController,
    BoxAndWiskers
} from "@sgratzl/chartjs-chart-boxplot";
import {quantile} from "simple-statistics";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    BoxPlotController,
    BoxAndWiskers,
    LineController,
    LineElement, BarElement,
    ArcElement
);


export function  Charts({data}: { data: Mutation[] }) {
    const PQ1 = 0.25
    const PQ3 = 0.75
    const MAX_HOUSE_VALUE = 1000000
    const MIN_HOUSE_VALUE = 100000
    const MAX_APPARTEMENT_VALUE = 1000000
    const MIN_APPARTEMENT_VALUE = 50000

    const houses = data.filter(mutation => isHouse(mutation) && isVente(mutation) && mutation.valeur_fonciere < MAX_HOUSE_VALUE && mutation.valeur_fonciere > MIN_HOUSE_VALUE);
    const appartements = data.filter(mutation => isAppartement(mutation) && isVente(mutation) && mutation.valeur_fonciere < MAX_APPARTEMENT_VALUE && mutation.valeur_fonciere > MIN_APPARTEMENT_VALUE);


    const housesSquareMeterValue = calculateSquareMeterValueByYear(houses)
    const appartementsSquareMeterValue = calculateSquareMeterValueByYear(appartements)
    const year = _.map(housesSquareMeterValue, 'year')
    const pricesHouses = _.map(housesSquareMeterValue, (value, index, collection) => {
        const q1 = quantile(value.pricesPerSquarMeter, PQ1)
        const q3 = quantile(value.pricesPerSquarMeter, PQ3);
        return _.filter(value.pricesPerSquarMeter, (x) => x >= q1 && x <= q3)
    })


    const pricesAppartement = _.map(appartementsSquareMeterValue, (value) => {
        const q1 = quantile(value.pricesPerSquarMeter, PQ1)
        const q3 = quantile(value.pricesPerSquarMeter, PQ3)
        return _.filter(value.pricesPerSquarMeter, (x) => x >= q1 && x <= q3)
    })

    const typebyyear = countPropertyTypesByYear(_.concat(houses, appartements))

    const typebycity = countPropertyTypesByCity(_.concat(houses, appartements))

    const citybarplot = {
        labels: _.map(typebycity, 'city'),
        datasets: [
            {
                backgroundColor: 'rgba(53, 162, 235, 1)',
                label: 'Houses',
                data: _.map(typebycity, (mutation: any) => {
                    return mutation.count.Maison
                })
            },
            {
                backgroundColor: 'rgba(255, 99, 132, 1)',
                label: 'Appartement',
                data: _.map(typebycity, (mutation: any) => {
                    return mutation.count.Appartement
                })
            },
        ]
    }

    const citybarplotOptions = {
        indexAxis: 'y' as const,
        plugins: {
            title: {
                display: true,
                text: "Count type of local by city"
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };



    const boxplotData = {
        labels: year,
        datasets: [
            {
                label: "Houses",
                borderWidth: 1,
                outlierColor: "#999999",
                padding: 10,
                itemRadius: 0,
                data: pricesHouses,
                backgroundColor: 'rgba(53, 162, 235, 1)',
            },
            {
                label: "Appartements",
                borderWidth: 1,
                outlierColor: "#999999",
                padding: 10,
                itemRadius: 0,
                data: pricesAppartement,
                backgroundColor: 'rgba(255, 99, 132, 1)',
            }
        ]
    };
    const boxplotOptions = {
        responsive: true,
        legend: {
            position: "top"
        },
        plugins : {
        title: {
            display: true,
            text: "Price per square meter by year"
        }

        }
    };
    const labels = year

    const barplotData = {
        labels,
        datasets: [
            {
                label: 'Houses',
                data: _.map(typebyyear, 'Maison'),
                backgroundColor: 'rgba(53, 162, 235, 1)',
            },
            {
                label: 'Appartement',
                data: _.map(typebyyear, 'Appartement'),
                backgroundColor: 'rgba(255, 99, 132,1)',
            },
        ],
    };
    const barplotOptions = {
        plugins: {
            title: {
                display: true,
                text: "Count type of local by year"
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    const lineplotData = {
        labels,
        datasets: [
            {
                label: 'Houses',
                data: _.map(pricesHouses, (pricesHousesPerSm: number[]) => {
                    return _.mean(pricesHousesPerSm)
                }),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 1)',
                tension: 0.1

            },
            {
                label: 'Appartements',
                data: _.map(pricesAppartement, (pricesAppartementPerSm: number[]) => {
                    return _.mean(pricesAppartementPerSm)
                }),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 1)',
                tension: 0.1

            }
        ],
    };
    const lineplotOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Price per square meter by year',
            },
        },
    };

    return (<div className={''}>
        <div>
            <h3 className="text-3xl font-bold dark:text-white pb-10">
                Charts</h3>
            <div className="grid grid-cols-2 gap-3 pb-5 h-full">
                <div className="p-5">
                    <Boxplot dataset={boxplotData} option={boxplotOptions}></Boxplot>
                    <Line data={lineplotData} options={lineplotOptions}></Line>
                </div>
                <div className="p-5">
                    <Bar options={citybarplotOptions} data={citybarplot}/>
                    <Bar options={barplotOptions} data={barplotData}/>
                </div>
            </div>
        </div>
    </div>)
}


function Boxplot({dataset, option}: { dataset: any, option: any }) {
    return <Chart type="boxplot" options={option} data={dataset}/>;
}
