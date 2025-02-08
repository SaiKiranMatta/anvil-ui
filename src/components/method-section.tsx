import { MethodCard } from './method-card';

interface MethodSectionProps {
  title: string;
  methods: Record<string, any>;
}

export function MethodSection({ title, methods }: MethodSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(methods).map((methodConfig) => (
          <MethodCard key={methodConfig.name} {...methodConfig} />
        ))}
      </div>
    </div>
  );
}