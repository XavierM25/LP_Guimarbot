# 🧠 Guía para implementar `@pheralb/toast` con un diseño personalizado (`Toast.astro`) en Astro

## 1. 🔧 ¿Qué es `@pheralb/toast`?

`@pheralb/toast` es una librería de notificaciones tipo _toast_ hecha para React. Se puede integrar en Astro usando el adaptador oficial `@astrojs/react`.

---

## 2. ✅ Estado actual del proyecto

- Ya está instalado `@pheralb/toast`.
- Se usa Astro con React (`@astrojs/react` ya instalado).
- Existe un archivo `src/components/toast/Toast.astro` que define el diseño del toast usando Tailwind.
- El objetivo es **usar ese diseño para mostrar notificaciones dinámicas con Pheralb Toast.**

---

## 3. 🧩 Estructura del diseño (`Toast.astro`)

El componente `Toast.astro` recibe:

```ts
const { title, description, icon, color } = Astro.props;
```

Y genera un bloque <figure> estilizado con Tailwind que incluye:

    ícono con color de fondo dinámico,

    título e imagen (HeadGuimar.svg),

    descripción con estilo font-onest.

## 4. ❗Problema

Los componentes .astro son estáticos y no se pueden mostrar dinámicamente como contenido de un toast en el cliente.
@pheralb/toast necesita contenido renderizado por React para funcionar como toast dinámico.

## 5. ✅ Solución: convertir Toast.astro en componente React
📄 Nuevo archivo: src/components/toast/ToastContent.tsx
```ts
export default function ToastContent({ title, description, icon, color }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <figure className="relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4 transition-all duration-200 ease-in-out hover:scale-[103%] bg-white shadow-md dark:bg-transparent dark:backdrop-blur-md dark:border dark:border-white/10 dark:shadow-[inset_0_-20px_80px_-20px_#ffffff1f]">
      <div className="flex flex-row items-center gap-3">
        <div className={`flex size-10 items-center justify-center rounded-2xl`} style={{ backgroundColor: `#${color}` }}>
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <div className="flex w-full items-center text-lg font-medium text-black">
            <span className="text-sm sm:text-lg font-onest">{title}</span>
            <img
              src="https://raw.githubusercontent.com/XavierM25/ResourceImageGuimarBot/refs/heads/main/HeadGuimar.svg"
              className="h-5.5 w-auto px-4"
            />
          </div>
          <p className="text-sm text-black/60 font-onest font-light">{description}</p>
        </div>
      </div>
    </figure>
  );
}
```

