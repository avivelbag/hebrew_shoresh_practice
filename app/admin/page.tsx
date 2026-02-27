import { ReviewForm } from "./ReviewForm";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Admin — Content Review</h1>
      <ReviewForm />
    </div>
  );
}
