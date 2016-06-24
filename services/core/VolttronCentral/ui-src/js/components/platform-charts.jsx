'use strict';

var React = require('react');
var PlatformChart = require('./platform-chart');
var modalActionCreators = require('../action-creators/modal-action-creators');
var platformActionCreators = require('../action-creators/platform-action-creators');
var NewChartForm = require('./new-chart-form');
var platformsStore = require('../stores/platforms-store');
var chartStore = require('../stores/platform-chart-store');
var statusIndicatorActionCreators = require('../action-creators/status-indicator-action-creators');
var platformManagerActionCreators = require('../action-creators/platform-manager-action-creators');

var PlatformCharts = React.createClass({
    getInitialState: function () {

        var state = {
            chartData: chartStore.getData(),
            historianRunning: platformsStore.getVcHistorianRunning()
        };

        return state;
    },
    componentDidMount: function () {
        chartStore.addChangeListener(this._onChartStoreChange);
        platformsStore.addChangeListener(this._onPlatformStoreChange);
    },
    componentWillUnmount: function () {
        chartStore.removeChangeListener(this._onChartStoreChange);
        platformsStore.removeChangeListener(this._onPlatformStoreChange);
    },
    _onChartStoreChange: function () {
        this.setState({chartData: chartStore.getData()});
    },
    _onPlatformStoreChange: function () {
        this.setState({historianRunning: platformsStore.getVcHistorianRunning()});
    },
    _onAddChartClick: function () {

        if (this.state.historianRunning)
        {
            platformActionCreators.loadChartTopics();

            modalActionCreators.openModal(<NewChartForm/>);
        }
        else
        {
            var message = "Chart topics can't be loaded. The VOLTTRON Central platform's historian is unavailable."
            statusIndicatorActionCreators.openStatusIndicator("error", message);
        }
    },
    render: function () {

        var chartData = this.state.chartData; 

        var platformCharts = [];

        for (var key in chartData)
        {
            if (chartData[key].data.length > 0)
            {
                var platformChart = <PlatformChart key={key} chart={chartData[key]} chartKey={key} hideControls={false}/>
                platformCharts.push(platformChart);
            }
        }

        if (platformCharts.length === 0)
        {
            var noCharts = <p className="empty-help">No charts have been loaded.</p>
            platformCharts.push(noCharts);
        }

        return (
            <div className="view">
                <div className="absolute_anchor">
                    <div className="view__actions">
                        <button
                            className="button"
                            onClick={this._onAddChartClick}
                        >
                            Add Chart
                        </button>
                    </div>
                    <h2>Charts</h2>
                    {platformCharts}
                </div>
            </div>
        );
    },
});

module.exports = PlatformCharts;
