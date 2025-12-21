"use client";

import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import { capitalizeString, isUUID } from "@/lib/string";

const Header = () => {

    const pathName = usePathname();
    const breadCrumbPath = useMemo(() => {
        const splittedPath = pathName.split("/")
            .filter((item) => item !== "")
            .map(val=>capitalizeString(val))
        return splittedPath;
    }, [pathName]);

    return <header className="backdrop-blur-lg p-4 w-full h-auto flex justify-between items-center sticky top-0 z-50">
        <div className="flex flex-col items-center w-full gap-2">
            <div className="flex w-full justify-between">
                <div className="flex w-full items-center gap-2">
                    <SidebarTrigger />
                    {/* {pathName == "/" && <p className="text-black text-sm">Dashboard</p>} */}
                    {  breadCrumbPath.length > 0 && (
                    <Breadcrumb>
                        <BreadcrumbList>
                        {breadCrumbPath.map((item, index) => {
                            const isValid = isUUID(item);
                            const paths = breadCrumbPath.filter((_val, idx) => idx <= index).map(val => val.toLowerCase());

                            return <div className="flex gap-2" key={item}>
                            <BreadcrumbItem>
                                <Link
                                className={`${index == breadCrumbPath.length - 1 ? "text-black dark:text-white" : ""}`}
                                href={`/${paths.join("/")}`}
                                >
                                {isValid ? "Detail" : item}
                                </Link>
                            </BreadcrumbItem>
                            {index != breadCrumbPath.length - 1 && <p>/</p>}
                            </div>
                        })}
                        </BreadcrumbList>
                    </Breadcrumb>
                    )}
                </div>
            </div>
        </div>  
    </header>
};

export default Header;
