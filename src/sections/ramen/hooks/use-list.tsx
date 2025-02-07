import { useEffect, useState } from "react";
import { get } from "@/utils/http";

export default function useList() {
  const [featuredList, setFeaturedList] = useState<any>([]);
  const [finishedList, setFinishedList] = useState<any>([]);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [finishedPage, setFinishedPage] = useState(1);

  const getFeaturedList = async () => {
    try {
      setFeaturedLoading(true);
      const res = await get(
        "https://prod-launchpad-1155389709.asia-southeast1.run.app/v1/featured-projects"
      );

      setFeaturedList(res.data.projects || []);
    } catch (err) {
      setFeaturedLoading(false);
    }
  };

  const getFinishedList = async () => {
    try {
      setFinishedLoading(true);
      const res = await get(
        `https://prod-launchpad-1155389709.asia-southeast1.run.app/v1/finished-launch?sort=slug&order=desc&page=${finishedPage}&rows=10`
      );

      setFinishedList(res.data.projects || []);
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
    setFinishedPage,
    featuredList,
    featuredLoading,
    finishedList,
    finishedLoading
  };
}
