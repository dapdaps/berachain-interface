import { useEffect, useState } from "react";
import { asyncFetch } from "@/utils/http";
import { TOKENS } from "../config";

export default function useList() {
  const [featuredList, setFeaturedList] = useState<any>([]);
  const [finishedList, setFinishedList] = useState<any>([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [finishedPage, setFinishedPage] = useState(1);
  const [finishedPageTotal, setFinishedPageTotal] = useState(1);
  const [finishedHasMore, setFinishedHasMore] = useState(true);

  const getFeaturedList = async () => {
    try {
      setFeaturedLoading(true);
      const res = await asyncFetch("/api.ramen/v1/featured-projects");
      const list = res.data.projects || [];
      setFeaturedList(list?.filter?.((item: any) => TOKENS[item.slug]) || []);
      setFeaturedLoading(false);
    } catch (err) {
      setFeaturedLoading(false);
    }
  };

  const getFinishedList = async () => {
    try {
      setFinishedLoading(true);
      const res = await asyncFetch(
        `/api.ramen/v1/finished-launch?sort=slug&order=desc&page=${finishedPage}&rows=10`
      );

      const { projects, total } = res.data;
      setFinishedList(projects || []);
      setFinishedPageTotal(Math.ceil(total / 10));
      setFinishedHasMore(10 * finishedPage < total);
      setFinishedLoading(false);
    } catch (err) {
      setFinishedLoading(false);
    }
  };

  useEffect(() => {
    getFeaturedList();
  }, []);

  useEffect(() => {
    getFinishedList();
  }, [finishedPage]);

  return {
    finishedPage,
    finishedPageTotal,
    finishedHasMore,
    setFinishedPage,
    featuredList,
    featuredLoading,
    finishedList,
    finishedLoading
  };
}
