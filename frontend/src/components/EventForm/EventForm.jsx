export default function EventForm({ name, setName, type, setType, isPrivate,
    setIsPrivate, price, setPrice, capacity, setCapacity, startDate,
    setStartDate, endDate, setEndDate, imageUrl, setImageUrl, venueId,
    setVenueId, description, setDescription, errors }) {

    return (
        <>
            <p>What is the name of your event?</p>
            <input
                type="text"
                placeholder="Event Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div className="split" />
            <label>
                <p>Is this an in person or online event?</p>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value='' disabled>(select one)</option>
                    <option value="Online">Online</option>
                    <option value="In person">In person</option>
                </select>
            </label>
            {type === 'In person' && <>
                <p>Where will your event be held?</p>
                <select value=''>
                    <option value='' disabled>(select a venue)</option>
                    {
                        //TODO once venues are created map through them for
                        //TODO options with value set to venue id
                    }
                </select>
            </>}
            <label >
                <p>Is this event private or public</p>
                <select
                    value={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.value)}
                >
                    <option value='' disabled>(select one)</option>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>
            </label>
            <p>What is the price for your event?</p>
            {
                //TODO fix price and capacity format / validation
            }
            <input
                style={{ textAlign: 'right', paddingRight: 10 }}
                type="number"
                inputMode="numeric"
                placeholder={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            <p style={{ marginBottom: 2 }}>What is the capacity of your event?</p>
            <p
                className="sub-caption"
                style={{ fontSize: 14 }}
            >
                (Amount of people that can attend)
            </p>
            <input
                style={{ textAlign: 'right', paddingRight: 10 }}
                type="number"
                inputMode="numeric"
                placeholder={0}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
            />
            <div className="split"></div>
            <p>When does your event start?</p>
            <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <p>When does your event end?</p>
            <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            <div className="split"></div>
            <p>Please add an image url for your event below</p>
            <input
                type="url"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
            />
            <p>Please describe your event:</p>
            <textarea
                placeholder="Please write at least 30 characters"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            {
                //* Below div just here to fix button placement
            }
            <div></div>
        </>
    )
}