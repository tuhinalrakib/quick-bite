import { useQuery } from '@tanstack/react-query';
import React from 'react';

const useFetchQuery = (key, api, apiMethod, queryOptions = {})=>{
    return useQuery({
        queryKey : key,
        queryFn : async()=>{
            const res = await apiMethod.get(`${api}`)
            return res.data;
        },
        ...queryOptions
    })
}

export default useFetchQuery;