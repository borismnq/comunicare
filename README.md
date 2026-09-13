# ComuniCare

PWA de comunicación asistida (CAA) para pacientes y cuidadores.

## Características

- Tablero de botones grandes con voz (TTS nativo)
- Botones editables con emoji, ícono o foto
- Categorías y plantillas en español
- Varios perfiles de paciente en el mismo dispositivo
- Área del cuidador protegida con PIN
- Mapa corporal de dolor
- 100% offline (IndexedDB + service worker)

## Desarrollo

```bash
npm install
npm run dev
```

## Producción

```bash
npm run build
npm run preview
```

Despliegue recomendado: Vercel (estático + HTTPS para instalar la PWA).
