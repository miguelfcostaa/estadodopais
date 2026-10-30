"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { localMaisProximo } from "@/lib/data";
import { COOKIE_GEO, guardarLocalProximo, lerCookie, marcarGeoPedido } from "@/lib/preferencias";

// Na primeira visita, pede a localização ao navegador e escolhe o local do IPMA mais próximo.
// As coordenadas ficam no navegador: só o nome do local é guardado (num cookie).
export function GeoLocal({ temLocal }: { temLocal: boolean }) {
  const router = useRouter();
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    if (temLocal || lerCookie(COOKIE_GEO) || !("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { local, km } = localMaisProximo(pos.coords.latitude, pos.coords.longitude);
        guardarLocalProximo(local.slug, km);
        router.refresh();
      },
      (erro) => {
        marcarGeoPedido();
        if (erro.code !== erro.PERMISSION_DENIED) setAviso("Não foi possível obter a sua localização. Pode escolher o local acima.");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 3600000 },
    );
  }, [temLocal, router]);

  return aviso ? <p className="geo-aviso mono">{aviso}</p> : null;
}
