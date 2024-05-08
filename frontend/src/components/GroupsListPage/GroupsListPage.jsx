import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getAllGroups, selectGroupsArray } from "../../store/groups";
import './GroupListPage.css';
import GroupCard from "./GroupCard";

export default function GroupsListPage() {
    const dispatch = useDispatch();

    const groups = useSelector(selectGroupsArray);
    useEffect(() => {
        dispatch(getAllGroups())
    }, [dispatch])

    return (
        <>
            <p>Groups in Grand Line Gatherings</p>
            <div className="card-container">
                {groups.map((group) => {
                    return (
                        <GroupCard
                            key={group.id}
                            group={group}
                        />
                    )
                })}
            </div>
        </>
    )
}