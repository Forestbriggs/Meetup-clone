export default function EventForm({ name, setName, type, setType, price,
    setPrice, capacity, setCapacity, startDate, setStartDate, endDate,
    setEndDate, imageUrl, setImageUrl, description, setDescription, errors }) {

    return (
        <>
            <p>What is the name of your event?</p>
            <input
                type="text"
                placeholder="Event Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div className="error-container">
                {errors.name && <p className='errors'>{errors.name}</p>}
            </div>
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
            <div className="error-container">
                {errors.type && <p className='errors'>{errors.type}</p>}
            </div>
            {/* {type === 'In person' && <>
                <p>Where will your event be held?</p>
                <select value=''>
                    <option value='' disabled>(select a venue)</option>
                    {
                        //TODO once venues are created map through them for
                        //TODO options with value set to venue id
                    }
                </select>
            </>} */}
            {/* <label >
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
            <div className="error-container">
                {errors.state && <p className='errors'>{errors.state}</p>}
            </div> */}
            <p>What is the price for your event?</p>
            {
                //TODO fix price and capacity format / validation
            }
            <input
                style={{ textAlign: 'right', paddingRight: 10 }}
                type="number"
                min={0}
                step={'.01'}
                placeholder={0}
                value={price}
                onChange={(e) => { setPrice(e.target.value) }}
            />
            <div className="error-container">
                {errors.price && <p className='errors'>{errors.price}</p>}
            </div>
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
                min={0}
                placeholder={0}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
            />
            <div className="error-container">
                {errors.capacity && <p className='errors'>{errors.capacity}</p>}
            </div>
            <div className="split"></div>
            <p>When does your event start?</p>
            <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <div className="error-container">
                {errors.startDate && <p className='errors'>{errors.startDate}</p>}
            </div>
            <p>When does your event end?</p>
            <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
            <div className="error-container">
                {errors.endDate && <p className='errors'>{errors.endDate}</p>}
            </div>
            <div className="split"></div>
            <p>Please add an image url for your event below</p>
            <input
                type="url"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
            />
            <div className="error-container">
                {errors.image && <p className='errors'>{errors.image}</p>}
            </div>
            <p>Please describe your event:</p>
            <textarea
                placeholder="Please write at least 30 characters"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <div className="error-container">
                {errors.description && <p className='errors'>{errors.description}</p>}
            </div>
            {
                //* Below div just here to fix button placement
            }
            <div></div>
        </>
    )
}