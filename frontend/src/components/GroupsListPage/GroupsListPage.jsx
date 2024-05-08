import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getAllGroups, selectGroupsArray } from "../../store/groups";

export default function GroupsListPage() {
    const dispatch = useDispatch();

    const groups = useSelector(selectGroupsArray);
    useEffect(() => {
        dispatch(getAllGroups())
    }, [dispatch])

    return (
        <>
            <div>
                <h1>Events</h1>
                <h1>Groups</h1>
            </div>
            <p>Groups in Grand Line Gatherings</p>
            <div>
                {groups.map((group) => {
                    return (
                        <div
                            key={group.id}
                        >
                            <h2>{group.name}</h2>
                        </div>
                    )
                })}
            </div>
        </>
    )
}