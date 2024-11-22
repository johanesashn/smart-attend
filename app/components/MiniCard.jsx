export default function MiniCard({title, subTitle, description}){
    return (
        <div className="p-8 py-4 rounded-xl border shadow">
            <div className="flex flex-row gap-4 items-center">
                <div>
                    <p className="text-lg font-semibold">{title}</p>
                    <p className="text-lg font-semibold mt-[-5px]">{subTitle}</p>
                </div>
                <p className="font-semibold text-6xl">{description}</p>
            </div>
        </div>
    )
}