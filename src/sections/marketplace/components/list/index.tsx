import Pager from "@/components/pager";

interface Meta {
    title: string;
    key: string | number;
    sort?: boolean;
    render?: (item: any, index: number) => React.ReactNode
}

interface Props {
    meta: Meta[],
    list: any[]
}

export default function List({ meta, list }: Props) {
    return <div>
        <table className="border-collapse w-[100%] mp-list">
            <thead>
                <tr>
                    {
                        meta.map(item => {
                            return <th key={item.key} className=" text-[14px] font-medium pl-[10px] py-[5px]">
                                <div className="text-center flex gap-[10px] items-center">
                                <span> {
                                    item.title
                                }</span>
                                {item.sort ? <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.8364 7.5C5.35356 8.16667 6.64644 8.16667 7.1636 7.5L11.818 1.5C12.3351 0.833334 11.6887 4.76837e-07 10.6544 4.76837e-07H1.34561C0.311302 4.76837e-07 -0.335141 0.833334 0.182014 1.5L4.8364 7.5Z" fill="#D1CEB4" />
                                </svg> : null
                                }
                                </div>
                            </th>
                        })
                    }

                </tr>
            </thead>
            <tbody>
                {
                    list.map((item: any, index: number) => {
                        return <tr className="rounded-md" key={item.id}>
                            {
                                meta.map(metaItem => {
                                    return <td key={item.key} className="text-left h-[58px] pl-[10px]">{
                                        metaItem.render ? metaItem.render(item, index) : item.title
                                    }</td>
                                })
                            }
                        </tr>
                    })
                }
            </tbody>
        </table>

        <div className="flex justify-end">
            <Pager  maxPage={4} onPageChange={() => {}}/>
        </div>
        
    </div>
}