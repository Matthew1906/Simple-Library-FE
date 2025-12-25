"use client";

import { TableFilter } from "@/lib/interface";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";
import { DateInput, DateRangeInput } from "../inputs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { endOfDay } from "date-fns";
import { capitalizeString } from "@/lib/string";

const TableFilterInput = (
    { filter, onChange } : 
    { filter: TableFilter; onChange: (_filter: TableFilter) => void; }
) => {

    const [searchValue, setSearchValue] = useState<string>(filter.type === 'search' ? filter?.value as string ?? "" : "");
    
    const [stringValue, setStringValue] = useState<string>((filter.type === 'string' || filter.type=='select') ? filter?.value as string ?? "" : "");
    
    const [numValue, setNumValue] = useState<number>(filter.type === 'number' ? Number((Array.isArray(filter?.value) ? filter.value[0] : filter.value)??0) ?? 0  : 0);
    
    const [maxNumValue, setMaxNumValue] = useState<number>(filter.type === 'numrange' ?Number((Array.isArray(filter?.value) ? filter.value[1] : filter.value)??0) ??0 : 0);
    
    const [startDateValue, setStartDateValue] = useState<Date | undefined>(filter.type === 'date' ? new Date(Number((Array.isArray(filter?.value) ? filter.value[0] : filter.value)??0) ?? 0) : undefined);
    
    const [endDateValue, setEndDateValue] = useState<Date | undefined>(filter.type === 'daterange' ? new Date(Number((Array.isArray(filter?.value) ? filter.value[1] : filter.value)??0)) : undefined);
            
    const [boolValue, setBoolValue] = useState<boolean>(filter.type === 'checkbox' ? filter.value as boolean??false:false);
    
    const commitValue = useCallback((override?:string) => {
        let val = undefined;
        switch (filter.type) {
            case "search":
                val = searchValue;
                break;
            case "string" :
                val = stringValue;
                break;
            case "number":
                val = numValue;
                break;
            case "numrange":
                if (numValue && maxNumValue) {
                    val = [numValue, maxNumValue];
                }
                break;
            case "date":
                if (startDateValue) {
                    const startDate = endOfDay(new Date(startDateValue))
                    val = startDate.getTime().toString();
                }
                break;
            case "daterange":
                if (startDateValue && endDateValue) {
                    const startDate = new Date(startDateValue);
                    const endDate = new Date(endDateValue);
                    val = [ endOfDay(startDate).getTime().toString(), endOfDay(endDate).getTime().toString()];
                }
                break;
            case "checkbox":
                val = boolValue;
                break;
            case "select":
                if (override?.includes("All")) val = undefined;
                else val = override;
                break;
        }
        onChange({ ...filter, value: val });
    }, [ searchValue, stringValue, numValue, maxNumValue, startDateValue, endDateValue, boolValue, onChange, filter ]);
    
    return <div className="flex flex-col justify-start gap-2 text-sm">
        <Label className="grow text-sm">{(filter.type === 'search' ? "Search " : "Filter by ") + capitalizeString(filter.label)}</Label>
        {filter.type === "string" ? (
            <Input
                value={stringValue}
                onChange={(event) => setStringValue(event.target.value)}
                onBlur={()=>commitValue}
                placeholder={stringValue ? stringValue : `Filter by ${filter.label}`}
            />
        ) : filter.type === "number" ? (
            <Input
                value={numValue}
                onBlur={()=>commitValue}
                onChange={(event) => setNumValue(Number.parseInt(event.target.value))}
                placeholder={numValue?.toString() ? numValue?.toString() : `Filter by ${filter.label}`}
                type="number"
            />
        ) : filter.type === "numrange" ? (
            <div className="flex items-center gap-2">
                <Input
                    className="w-24 "
                    value={numValue}
                    onChange={(event) => setNumValue(Number.parseInt(event.target.value))}
                    onBlur={()=>commitValue}
                    type="number"
                    placeholder="Number"
                />
                -
                <Input
                    className="w-24 "
                    value={maxNumValue}
                    onChange={(event) => setMaxNumValue(Number.parseInt(event.target.value))}
                    onBlur={()=>commitValue}
                    type="number"
                    placeholder="Number"
                />
            </div>
        ) : filter.type === "date" ? (
            <DateInput 
                date={startDateValue} 
                setDate={
                (val)=>{
                    setStartDateValue(val)
                    commitValue()
                }} 
            />
        ) : filter.type === "daterange" ? (
            <DateRangeInput
                date={startDateValue && endDateValue ? { from: startDateValue, to: endDateValue } : undefined}
                setDate={(range) => {
                    setStartDateValue(range?.from)
                    setEndDateValue(range?.to)
                    commitValue()
                }}
                setStartDate={(val)=>{
                    setStartDateValue(val)
                    commitValue()
                }}
                setEndDate={(val)=>{
                    setEndDateValue(val)
                    commitValue()
                }}
            />
        ) : filter.type === "select" ? (
            <Select 
                onValueChange={(val)=>{
                    setStringValue(val)
                    commitValue(val)
                }} 
                value={stringValue}
            >
                <SelectTrigger className="w-45 text-[--placeholder-text-color]">
                    <SelectValue placeholder={stringValue ? stringValue : `Select ${filter.label}`}/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={"All"}>All {filter.label}</SelectItem>
                    {(filter.options ?? []).map((option) => {
                        if(typeof option === 'string'){
                            return <SelectItem value={option} key={option}>
                                {option}
                            </SelectItem>
                        } else {
                            return <SelectItem value={option.key} key={option.key}>
                                {option.value}
                            </SelectItem>
                        }
                    })} 
                </SelectContent>
            </Select>
        ) : filter.type === "search" ? (
            <Input
                value={searchValue} 
                onBlur={()=>commitValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder={searchValue ? searchValue : `Search ${filter.label}`}
            />
        ) : (
            <Checkbox
                defaultChecked={boolValue}
                onCheckedChange={(checked) => {
                    setBoolValue(checked !== "indeterminate" ? checked : false)
                    commitValue()
                }}
            />
        )}
    </div>
};

export default TableFilterInput;
