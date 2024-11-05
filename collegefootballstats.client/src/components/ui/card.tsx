import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ style, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        borderRadius: '0.5rem',
        border: '1px solid var(--gray-200)',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        ...style
      }}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ style, ...props }, ref) => (
    <div
      ref={ref}
      style={{
        padding: '1.5rem',
        ...style
      }}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";