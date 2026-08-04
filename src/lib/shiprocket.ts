export async function estimateShiprocketDelivery(
  pincode: string
): Promise<ShiprocketEstimate> {
  const cleanPin = String(pincode || "").trim();

  if (!/^[0-9]{6}$/.test(cleanPin)) {
    throw new Error("Invalid pincode");
  }

  const token = await getShiprocketToken();

  // Your warehouse pincode
  const shipFrom =
    process.env.SHIPROCKET_PICKUP_PINCODE || "600128";

  const url = new URL(
    "https://apiv2.shiprocket.in/v1/external/courier/serviceability/"
  );

  url.searchParams.set("pickup_postcode", shipFrom);
  url.searchParams.set("delivery_postcode", cleanPin);
  url.searchParams.set("cod", "1");
  url.searchParams.set("weight", "0.5");

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = await res.json();

  console.log("========== SHIPROCKET ==========");
  console.log(JSON.stringify(data, null, 2));
  console.log("================================");

  if (!res.ok) {
    throw new Error(
      `Shiprocket serviceability failed (${res.status}) ${JSON.stringify(data)}`
    );
  }

  const candidates =
    data?.available_courier_companies ??
    data?.data?.available_courier_companies ??
    data?.data ??
    [];

  if (!Array.isArray(candidates) || candidates.length === 0) {
    return {
      serviceable: false,
      cod_available: false,
      delivery_days: null,
      estimated_delivery_date: null,
      courier_name: null,
      shipping_charge: null,
      raw: data,
    };
  }

  const first = candidates[0];

  const deliveryDays =
    Number(
      first.estimated_delivery_days ??
      first.delivery_days ??
      first.etd ??
      null
    ) || null;

  return {
    serviceable: true,
    cod_available: Boolean(
      first.cod_available ??
      first.is_cod_available ??
      first.cod
    ),
    delivery_days: deliveryDays,
    estimated_delivery_date: normalizeDate(deliveryDays),
    courier_name:
      first.courier_name ??
      first.courier_company_name ??
      null,
    shipping_charge:
      Number(
        first.freight_charge ??
        first.rate ??
        0
      ) || 0,
    raw: data,
  };
}
