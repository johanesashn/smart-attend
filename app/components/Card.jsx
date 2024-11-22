export default function Card({title, description}){
    return (
        <div className="rounded-xl border shadow">
            {/* <figure> */}
                <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes" />
            {/* </figure> */}
            <div className="p-4 px-8">
                <h2 className="card-title">{title}</h2>
                <p>{description}</p>
                <p>day / hour</p>
            </div>
        </div>
    )
}
