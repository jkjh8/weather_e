export default function () {
  return {
    location: {
      address: '',
      x: 0,
      y: 0
    },
    weather: {
      date: '',
      time: '',
      T1H: { name: '기온', type: 'C', value: 0 },
      RN1: { name: '강수량', type: 'mm', value: 0 },
      UUU: { name: '동서바람성분', type: 'm/s', value: 0 },
      VVV: { name: '남북바람성분', type: 'm/s', value: 0 },
      REH: { name: '습도', type: '%', value: 0 },
      PTY: { name: '강수형태', type: 'code', value: 0 },
      VEC: { name: '풍향', type: 'deg', value: 0 },
      WSD: { name: '풍속', type: 'm/s', value: 0 },
      location: {
        address: '',
        x: 0,
        y: 0
      }
    }
  }
}
