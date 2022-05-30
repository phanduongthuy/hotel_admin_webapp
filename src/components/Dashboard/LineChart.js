import {Line} from '../Charts/BaseCharts'

export default {
    extends: Line,
    props: ['labels', 'data'],
    mounted() {
        this.renderChart({
            labels: this.labels,
            datasets: [
                {
                    label: 'Doanh số',
                    data: this.data,
                    fill: true,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgba(75,192,192,1)",
                    pointRadius: 4,
                    borderWidth: 1,
                    lineTension: 0
                }
            ]
        }, {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        userCallback: function (value) {
                            value = value.toString();
                            value = value.split(/(?=(?:...)*$)/);
                            value = value.join(',');
                            return value + ' đ';
                        }
                    }
                }]
            },
            tooltips: {
                callbacks:{
                    label:  (value) => {
                        let money = value.yLabel;
                        money = money.toString();
                        money = money.split(/(?=(?:...)*$)/);
                        money = money.join(',');
                        return 'Danh số: ' + money + ' đ';
                    }
                }
            }
        })
    },
    watch: {
        data() {
            this.renderChart({
                labels: this.labels,
                datasets: [
                    {
                        label: 'Doanh số',
                        data: this.data,
                        fill: true,
                        backgroundColor: "rgba(75,192,192,0.2)",
                        borderColor: "rgba(75,192,192,1)",
                        pointRadius: 4,
                        borderWidth: 1,
                        lineTension: 0
                    }
                ]
            }, {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            userCallback: function (value) {
                                value = value.toString();
                                value = value.split(/(?=(?:...)*$)/);
                                value = value.join(',');
                                return value + ' đ';
                            }
                        }
                    }]
                },
                tooltips: {
                    callbacks:{
                        label:  (value) => {
                            let money = value.yLabel;
                            money = money.toString();
                            money = money.split(/(?=(?:...)*$)/);
                            money = money.join(',');
                            return 'Danh số: ' + money + ' đ';
                        }
                    }
                }
            })
        },
    },
}