import { getBookDetails } from "@/lib/database";

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const bookDetails = await getBookDetails(id);

    return (
        <div>   
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">كتاب {bookDetails?.Title || "بلا عنوان"}</h1>
            {/* Table of details */}
            <div className="mt-6">
                <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                    <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-700">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-white">عنوان الكتاب</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">{bookDetails?.Title || "—"}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-white">تاريخ الرفع</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">{bookDetails?.["Upload Date"] || "—"}</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-white">المنصات المرتبطة</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                                {Array.isArray(bookDetails?.Platform) && bookDetails.Platform.length > 0
                                    ? bookDetails.Platform.join(", ")
                                    : "—"}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}