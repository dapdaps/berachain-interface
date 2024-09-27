import Fee from "./Fee";

export default function Routes() {
    return <div className="border border-[#373A53] rounded-[12px] mt-[10px] p-[10px]">
        <Fee name="Price impact" value="1"/>
        <Fee name="Gas fee" value="1"/>
        <Fee name="Minimum received" value="1"/>
        <Fee name="Route" value="1"/>
    </div>
}