
# 🎧 Audio Reactive Visualizer

Una visualización 3D interactiva y reactiva al audio, creada con **Three.js**, **dat.GUI** y shaders personalizados. Permite controlar en tiempo real diversos parámetros de la animación y del sonido.

---

## 🚀 Demo

¡Haz clic en la pantalla y empieza la experiencia visual y sonora!

---

## 📂 Estructura del Proyecto

```
├── index.html
├── src/
│   └── main.js
│   └── model/
│       └── reactive-sphere.js
├── files/
│   └── RTL.mp3
│   └── TAK.mp3
│   └── Soul.mp3
│   └── Funky.mp3
```

---

## 🎮 Controles de la Interfaz (dat.GUI)

- **Amplitude**: Intensidad de la deformación reactiva.
- **Frequency**: Frecuencia de desplazamiento visual.
- **Freq Start (Hz)**: Frecuencia de inicio para análisis de audio.
- **Freq End (Hz)**: Frecuencia de fin para análisis de audio.
- **Speed**: Velocidad de la animación.
- **Base Color**: Color base de la malla.
- **Displacement**: Tipo de desplazamiento (`Noise` o `Sine`).
- **Song**: Selecciona la canción a reproducir.
- **Wireframe**: Activa/desactiva la vista en modo wireframe.
- **Background**: 
  - `Fixed`: Usa un color constante.
  - `Reactive`: Cambia de color con los beats.

---

## 🎵 Reproducción de Audio

- Clic en pantalla para iniciar el audio.
- Puedes alternar entre las canciones disponibles desde la interfaz.
- El fondo y la geometría reaccionan visualmente a las frecuencias del audio.

---

## 📦 Instalación y Uso

1. Clona este repositorio:

```bash
git clone https://github.com/tu_usuario/audio-visualizer.git
cd audio-visualizer
```

2. Instala las dependencias si usas Vite (recomendado):

```bash
npm install
npm run dev
```

3. Abre `http://localhost:5173/` en tu navegador.

---

## 📹 Exportar Grabaciones

Para grabar la visualización puedes:
- Usar herramientas como OBS Studio o QuickTime.
- (Próximamente) Integración con CCapture.js para grabación automática.

---

## 📚 Tecnologías Utilizadas

- [Three.js](https://threejs.org/)
- [dat.GUI](https://github.com/dataarts/dat.gui)
- [Vite.js](https://vitejs.dev/) (para desarrollo rápido)

---

## 📝 Licencia

MIT License.
