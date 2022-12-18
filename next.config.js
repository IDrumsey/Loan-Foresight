/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // https://github.com/chartjs/Chart.js/issues/9390#issuecomment-1263680623
  // https://stackoverflow.com/questions/73840076/error-rangeerror-minimumfractiondigits-value-is-out-of-range-with-chartjs-in?noredirect=1&lq=1
  // https://github.com/chartjs/Chart.js/issues/10673
  swcMinify: false,
}

module.exports = nextConfig
