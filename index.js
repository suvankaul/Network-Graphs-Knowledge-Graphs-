// let dataFile = require('./data_new.js');
import data from './data_new';
console.log('DATA FILE', data);
const graphData = data;
console.log('GRAPH DATA', graphData);
let level0 = [...new Set(graphData.map((data) => data.audience))];
console.log('LEVEL 0', level0);
let level1 = [];
let level2metakw = [];
level1 = [...new Set(graphData.map((data) => data.category))];
console.log('LEVEL 1', level1);
level2metakw = [...new Set(graphData.map((data) => data.keyword))];
console.log('LEVEL 2 metakws', level2metakw);

Highcharts.addEvent(Highcharts.Series, 'afterSetOptions', function (e) {
  // var colors = Highcharts.getOptions().colors,
  var colors = [
    '#4a90e2',
    '#39485b',
    '#FF9933',
    '#FFCC33',
    '#34a84f',
    '#257b37',
    '#d63b3b',
    '#56677b',
    '#c58516',
    '#972020',
    '#faaeae',
    '#29b6f6',
    '#925c00',
  ];
  let i = 2;
  let nodes = {};

  ////////////////////console.log(colors);
  if (
    this instanceof Highcharts.seriesTypes.networkgraph &&
    e.options.id === 'lang-tree'
  ) {
    e.options.data.forEach(function (link) {
      // ////////////////////console.log('link', link);
      if (level0.findIndex((t) => t == link[0]) > -1) {
        // ////////////////////console.log('ttttttttttttttttttttttttt');
        nodes[link[0]] = {
          id: link[0],
          marker: {
            radius: graphData.filter((data) => data.audience === link[0])[0][
              'audience_radius'
            ],
          },
          linkLength: 2000,
          link: {
            length: 1000,
          },
        };
        nodes[link[1]] = {
          id: link[1],
          marker: {
            radius: graphData.filter((data) => data.category === link[1])[0][
              'category_radius'
            ],
          },
          link: {
            length: 1000,
          },
          color: colors[i++],
        };
        // nodes[link[1]] = {
        //   id: link[1],
        //   marker: {
        //     radius: level1Data.filter((data) => data.category === link[1])[0][
        //       'value'
        //     ],
        //   },
        //   color: colors[i++],
        // };
        // ////////////////////console.log(nodes);
      }
      // } else if (level1.findIndex((t) => t == link[0]) > -1) {
      //   // ////////////////////console.log('ttttttttttttttttttttttttt');
      //   nodes[link[0]] = {
      //     id: link[0],
      //     marker: {
      //       radius: level1Data.filter((data) => data.category === link[0])[0][
      //         'value'
      //       ],
      //     },
      //     color: colors[i++],
      //   };
      //   // nodes[link[1]] = {
      //   //   id: link[1],
      //   //   marker: {
      //   //     radius: 15,
      //   //   },
      //   //   color: colors[i++],
      //   // };
      // }
      if (level2metakw.findIndex((t) => t == link[1]) > -1) {
        // ////////////////////console.log('ttttttttttttttttttttttttt', link[1]);
        nodes[link[1]] = {
          id: link[1],
          marker: {
            radius: graphData.filter((data) => data.keyword === link[1])[0][
              'keyword_radius'
            ],
          },
          link: {
            length: 1000,
          },

          // color: colors[i++],
          color: nodes[link[0]].color,
        };
      }
      // ////////////////////console.log(nodes);
      // if (link[0] === 'STM' || link[0] === 'Conversion Ready') {
      //   nodes['STM'] = {
      //     id: 'STM',
      //     marker: {
      //       radius: 30,
      //     },
      //   };
      //   nodes['Conversion Ready'] = {
      //     id: 'Conversion Ready',
      //     marker: {
      //       radius: 30,
      //     },
      //   };
      //   nodes['Fan Development'] = {
      //     id: 'Fan Development',
      //     marker: {
      //       radius: 30,
      //     },
      //   };
      //   nodes[link[1]] = {
      //     id: link[1],
      //     marker: {
      //       radius: 15,
      //     },
      //     color: colors[i++],
      //   };
      // }
      // else if (nodes[link[0]] && nodes[link[0]].color) {
      //   nodes[link[1]] = {
      //     id: link[1],
      //     color: nodes[link[0]].color,
      //   };
      // }
    });
    ////////////////////console.log(nodes);
    e.options.nodes = Object.keys(nodes).map(function (id) {
      return nodes[id];
    });
  }
});

Highcharts.chart('container', {
  chart: {
    type: 'networkgraph',
    height: '100%',
  },
  title: {
    text: 'Elevate Web Scraping',
  },
  subtitle: {
    text: 'Relation between Audience, Category, and Meta Keywords',
  },
  plotOptions: {
    networkgraph: {
      keys: ['from', 'to'],

      layoutAlgorithm: {
        enableSimulation: false,
        // friction: -0.958,
        integration: 'euler',
        // integration: 'verlet',
        linkLength: 70,
        // initialPositions: 'random',
        // // Applied only to links, should be 0
        // attractiveForce: function () {
        //     return 0;
        // },
        // repulsiveForce: function () {
        //     return 25;
        // },
        // integration: 'euler',
        // Half of the repulsive force
        // gravitationalConstant: 0.01
      },
    },
  },
  tooltip: {
    enabled: true,
    formatter: function () {
      // console.log("hell",this.point.linksTo[0]['from'], this.point.name);
      if (level2metakw.findIndex((t) => t == this.point.name) > -1) {
        console.log(this.point);
        let data = graphData.filter((data) => data.keyword === this.point.name);
        console.log(data);
        let str = `<b>${this.point.name}</b><br>`;
        data.forEach((d, d_i) => {
          if (d_i === data.length - 1) {
            str += `${d['audience']} -> ${d['category']}: <b>${d['count']} users</b>`;
          } else {
            str += `${d['audience']} -> ${d['category']}: <b>${d['count']} users</b> <br>`;
          }
        });
        return str;
      }
      return this.point.name;
    },
  },
  series: [
    {
      name: level0[0],
      showInLegend: true,
      dataLabels: {
        enabled: true,
        // linkFormat: '',
        // enabled: true,
        // linkTextPath: {
        //     // attributes: {
        //     //     dy: 12
        //     // }
        // },
        // linkFormat: '{point.fromNode.name} \u2192 {point.toNode.name}',
        linkFormatter: function () {
          // if (level2metakw.findIndex((t) => t == this.point.toNode.name) > -1) {
          //   console.log(this.point);
          //   let data = level2metakwData.filter(data => data.keyword === this.point.toNode.name);
          //   let str = ''
          //   data.forEach((d,d_i) => {
          //     if(d_i === data.length - 1) {
          //       str += `${d['audience']}: ${d['value']}`
          //     } else {
          //       str += `${d['audience']}: ${d['value']}, `
          //     }
          //   })
          //   return str;
          // }
          // return `${this.point.fromNode.name} \u2192 ${this.point.toNode.name}`
        },
        // textPath: {
        //     enabled: true,
        //     // attributes: {
        //     //     dy: 14,
        //     //     startOffset: '45%',
        //     //     textLength: 80
        //     // }
        // },
        // format: '{point.name}'
      },
      id: 'lang-tree',

      data: [
        ['STM', 'Arts & Entertainment'],
        ['Arts & Entertainment', 'cnn'],
        ['Arts & Entertainment', 'cnnpolitics'],
        ['Arts & Entertainment', 'politics'],
        ['Arts & Entertainment', 'entertainment'],
        ['Arts & Entertainment', 'nfl'],
        ['Arts & Entertainment', 'sport'],
        ['Arts & Entertainment', 'health'],
        ['Arts & Entertainment', 'game'],
        ['Arts & Entertainment', 'video'],
        ['Arts & Entertainment', 'world'],
        ['STM', 'Sports'],
        ['Sports', 'nfl'],
        ['Sports', 'football'],
        ['Sports', 'sport'],
        ['Sports', 'car'],
        ['Sports', 'jalopnik'],
        ['Sports', 'soccer'],
        ['Sports', 'cnn'],
        ['Sports', 'nba'],
        ['Sports', 'video'],
        ['Sports', 'college football'],
        ['STM', 'Technology & Computing'],
        ['Technology & Computing', 'business'],
        ['Technology & Computing', 'general news'],
        ['Technology & Computing', 'sport'],
        ['Technology & Computing', 'nfl'],
        ['Technology & Computing', 'donald trump'],
        ['Technology & Computing', 'united states'],
        ['Technology & Computing', 'health'],
        ['Technology & Computing', 'entertainment'],
        ['Technology & Computing', 'covid'],
        ['Technology & Computing', 'shooting'],
        ['Conversion Ready', 'Arts & Entertainment'],
        ['Arts & Entertainment', 'cnn'],
        ['Conversion Ready', 'Arts & Entertainment'],
        ['Arts & Entertainment', 'cnn'],
        ['Arts & Entertainment', 'politics'],
        ['Arts & Entertainment', 'cnnpolitics'],
        ['Arts & Entertainment', 'dailymail news'],
        ['Arts & Entertainment', 'joe biden'],
        ['Arts & Entertainment', 'sport'],
        ['Arts & Entertainment', 'donald trump'],
        ['Arts & Entertainment', 'entertainment'],
        ['Arts & Entertainment', 'nfl'],
        ['Arts & Entertainment', 'health'],
        ['Conversion Ready', 'Sports'],
        ['Sports', 'cnn'],
        ['Sports', 'nfl'],
        ['Sports', 'logos logo'],
        ['Sports', 'football'],
        ['Sports', 'college football'],
        ['Sports', 'united states'],
        ['Sports', 'minor league'],
        ['Sports', 'los angeles'],
        ['Sports', 'sport'],
        ['Sports', 'jalopnik'],
        ['Conversion Ready', 'Technology & Computing'],
        ['Technology & Computing', 'joe biden'],
        ['Technology & Computing', 'sport'],
        ['Technology & Computing', 'football'],
        ['Technology & Computing', 'general news'],
        ['Technology & Computing', 'donald trump'],
        ['Technology & Computing', 'united states'],
        ['Technology & Computing', 'cnn'],
        ['Technology & Computing', 'nfl'],
        ['Technology & Computing', 'entertainment'],
        ['Technology & Computing', 'gizmodo'],
        ['Fan Development', 'Arts & Entertainment'],
        ['Arts & Entertainment', 'cnn'],
        ['Arts & Entertainment', 'joe biden'],
        ['Arts & Entertainment', 'dailymail news'],
        ['Arts & Entertainment', 'news new'],
        ['Arts & Entertainment', 'donald trump'],
        ['Arts & Entertainment', 'politic'],
        ['Arts & Entertainment', 'cnnpolitics'],
        ['Arts & Entertainment', 'entertainment'],
        ['Arts & Entertainment', 'music new'],
        ['Arts & Entertainment', 'dailymail tvshowbiz'],
        ['Fan Development', 'Sports'],
        ['Sports', 'picks prediction'],
        ['Sports', 'college football'],
        ['Sports', 'cnn'],
        ['Sports', 'sport'],
        ['Sports', 'nfl'],
        ['Sports', 'los angeles'],
        ['Sports', 'nba'],
        ['Sports', 'dailymail news'],
        ['Sports', 'green bay'],
        ['Sports', 'notre dame'],
        ['Fan Development', 'Technology & Computing'],
        ['Technology & Computing', 'joe biden'],
        ['Technology & Computing', 'donald trump'],
        ['Technology & Computing', 'cnn'],
        ['Technology & Computing', 'general news'],
        ['Technology & Computing', 'sport'],
        ['Technology & Computing', 'county'],
        ['Technology & Computing', 'police'],
        ['Technology & Computing', 'united states'],
        ['Technology & Computing', 'new york'],
        ['Technology & Computing', 'entertainment'],
      ],
    },
  ],
});
