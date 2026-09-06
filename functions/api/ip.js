export async function onRequestGet({ request }) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const cf = request.cf ?? {};

  return Response.json({
    ip,
    country: cf.country,        // 国家代码 CN / US
    continent: cf.continent,    // 大洲 AS
    region: cf.region,          // 省份/地区名，例如 Jiangsu
    regionCode: cf.regionCode,  // 地区代码
    city: cf.city,              // 城市 Suzhou
    timezone: cf.timezone,      // Asia/Shanghai
    asn: cf.asn
  }, {
    headers: { "Access-Control-Allow-Origin": "*" }
  });
}