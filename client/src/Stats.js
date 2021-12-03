import React, { useEffect } from "react";
import { CanvasJSChart } from "canvasjs-react-charts";

import { useMoralisQuery } from "react-moralis";
const Stats = ({ tokenId }) => {
    const [points, setPoints] = React.useState();
    const { data } = useMoralisQuery("Transactions", (query) =>
        query.equalTo("tokenId", tokenId)
    );
    useEffect(() => {
        if (data) {
            let objList = data.map((item) => {
                return {
                    x: item.attributes.block_timestamp,
                    y: parseFloat((item.attributes.amount / 1e18).toFixed(5)),
                };
            });
            setPoints(objList);
        }
    }, [data]);
    const options = {
        animationEnabled: true,
        title: {
            text: "Trade History",
        },
        axisX: {
            title: "Time",
            valueFormatString: "MMM",
        },
        axisY: {
            title: "Price",
            prefix: "Ξ",
        },
        data: [
            {
                yValueFormatString: "Ξ#.#####",
                xValueFormatString: "MMMM",
                type: "spline",
                dataPoints: points,
            },
        ],
    };
    return (
        <div className="stats">
            <CanvasJSChart
                options={options}
                /* onRef={ref => this.chart = ref} */
            />
            {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
        </div>
    );
};

export default Stats;
