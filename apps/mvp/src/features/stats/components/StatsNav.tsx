import { useTranslations } from "next-intl"

const   StatsNav = ({ range, onChange }: { range: any, onChange: (e: any) => void }) => {
  const t = useTranslations("StatsPage")
  return (
    <section className="flex bg-white shadow-md dark:border-[#151046] dark:border-2 dark:bg-gradient-to-b from-[#100c28] to-[#010216] p-5 rounded-lg w-full justify-between">
      <div className="grid p-1">
        <h1 className="font-bold text-2xl">{t("title")}</h1>
        <p className="text-muted-foreground text-sm">{t("subtitle")}</p>
      </div>
      <div className="flex gap-2 items-center">
        <select aria-label={t("range_label")} className="border-2 rounded-md px-3 py-2 dark:border-[#151046] dark:border-2" value={range} onChange={onChange} >
          <option value="7d" className="bg-[#100c28]">
            {t("range_7d")}
          </option>
          <option value="30d" className="bg-[#100c28]">
            {t("range_30d")}
          </option>
          <option value="90d" className="bg-[#100c28]">
            {t("range_90d")}
          </option>
        </select>
      </div>
    </section>
  )
}

export default StatsNav