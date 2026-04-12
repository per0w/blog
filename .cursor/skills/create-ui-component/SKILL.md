---
name: create-ui-component
description: >-
  Создаёт красивый, доступный React-компонент в дизайн-системе Trenika.
  Использовать когда нужно создать UI-компонент, кнопку, карточку, инпут,
  модал, или любой переиспользуемый элемент интерфейса.
---

# Create UI Component

## Где размещать

| Тип              | Путь                            | Когда                                |
| ---------------- | ------------------------------- | ------------------------------------ |
| UI-kit (базовый) | `shared/ui/<Component>.tsx`     | Button, Input, Card, Badge, Skeleton |
| Доменный виджет  | `widgets/<domain>/<Widget>.tsx` | WorkoutCard, ProgressChart           |
| Фича-компонент   | `features/<domain>/components/` | CreateWorkoutForm                    |

## Шаблон компонента

```typescript
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/shared/lib/cn';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all',
          'active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? <Spinner className="mr-2" /> : null}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
```

## Утилита cn

```typescript
// shared/lib/cn.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Правила создания

### Обязательно

- `forwardRef` для компонентов-обёрток HTML-элементов.
- Принимать `className` для кастомизации через `cn()`.
- Spread `...props` для расширяемости.
- `displayName` для DevTools.
- Все варианты через пропсы, не через отдельные компоненты.

### Стилизация

- Tailwind CSS utility classes.
- Варианты через объект-маппинг, не через длинные тернарники.
- `active:scale-95` для тактильного фидбэка кнопок.
- `transition-all duration-150` для плавности.
- `focus-visible:` для keyboard focus (не `focus:`).
- Тёмная тема: `dark:bg-...` или CSS-переменные.

### Доступность

- Интерактивные элементы: правильный HTML-тег (`button`, `a`, `input`).
- Иконки-кнопки: `aria-label`.
- Состояния: `aria-disabled`, `aria-busy` для loading.
- Ошибки: `aria-invalid`, `aria-describedby` → error message.
- Модалы: `role="dialog"`, `aria-modal="true"`, focus trap.

### Размеры (touch-friendly)

```typescript
const sizes = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-4 text-base rounded-xl",
  lg: "h-13 px-6 text-lg rounded-xl",
} as const;
```

Минимум 44px высоты для touch на мобильном.

## Каталог базовых компонентов

| Компонент   | Варианты                                               | Файл                        |
| ----------- | ------------------------------------------------------ | --------------------------- |
| Button      | primary, secondary, ghost, danger + sm/md/lg + loading | `shared/ui/Button.tsx`      |
| Input       | default + error + disabled + label + helperText        | `shared/ui/Input.tsx`       |
| Card        | default + interactive (hover/active)                   | `shared/ui/Card.tsx`        |
| Badge       | success, warning, error, neutral                       | `shared/ui/Badge.tsx`       |
| Skeleton    | width/height props, rounded                            | `shared/ui/Skeleton.tsx`    |
| BottomSheet | open/onClose, title, snap points                       | `shared/ui/BottomSheet.tsx` |
| EmptyState  | icon, title, description, action                       | `shared/ui/EmptyState.tsx`  |
| Toast       | success, error, info                                   | `shared/ui/Toast.tsx`       |
| Spinner     | size sm/md/lg                                          | `shared/ui/Spinner.tsx`     |

## Чеклист

- [ ] Компонент принимает `className` и `...props`.
- [ ] Touch target минимум 44px.
- [ ] Loading/disabled состояния обработаны.
- [ ] Accessibility: правильные ARIA-атрибуты.
- [ ] Тёмная тема работает.
- [ ] `active:scale-95` для кнопок.
- [ ] Компонент типизирован без `any`.
