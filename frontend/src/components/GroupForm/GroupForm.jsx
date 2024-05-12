export default function GroupForm({ formType, location, setLocation, name, setName, about,
    setAbout, type, setType, isPrivate, setIsPrivate, imageUrl, setImageUrl, errors
}) {

    return (
        <>
            <h2>First, set your group&apos;s location.</h2>
            <p className='caption'>
                Grand Line Gathering groups meet locally, in person, and online.
                We&apos;ll connect you with people in your area, and more can
                join you online.
            </p>
            <input
                type="text"
                placeholder='City, STATE'
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />
            <div className="error-container">
                {errors.city && <p className='errors'>{errors.city}</p>}
            </div>
            <div className="error-container">
                {errors.state && <p className='errors'>{errors.state}</p>}
            </div>
            <div className='split' />
            <h2>What will your group&apos;s name be?</h2>
            <p className="caption" style={{ marginBottom: 0 }}>
                Choose a name that will give people a clear idea of what the
                group is about.
            </p>
            <p className='sub-caption'>
                Feel free to get creative! You can edit this
                later if you change your mind.
            </p>
            <input
                type="text"
                placeholder='What is your group name?'
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div className="error-container">
                {errors.name && <p className="errors">{errors.name}</p>}
            </div>
            <div className="split" />
            <h2>Now describe what your group will be about</h2>
            <p className="caption">
                People will see this when we promote your group, but
                you&apos;ll be able to add to it later, too.
            </p>
            <ol>
                <li>What&apos;s the purpose of the group?</li>
                <li>Who should join?</li>
                <li>What will you do at your events?</li>
            </ol>
            <textarea
                name="description"
                placeholder='Please write at least 30 characters'
                value={about}
                onChange={(e => setAbout(e.target.value))}
            />
            <div className='error-container'>
                {errors.about && <p className='errors'>{errors.about}</p>}
            </div>
            <div className="split" />
            <h2>Final steps...</h2>
            <label>
                <p>Is this an in person or online group?</p>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value={'null'} disabled={true}>(select one)</option>
                    <option value={'Online'}>Online</option>
                    <option value={'In person'}>In person</option>
                </select>
            </label>
            <div className='error-container'>
                {errors.type && <p className='errors'>{errors.type}</p>}
            </div>
            <label>
                <p>Is this group private or public?</p>
                <select
                    value={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.value)}
                >
                    <option value={'null'} disabled={true}>(select one)</option>
                    <option value={true}>Private</option>
                    <option value={false}>Public</option>
                </select>
            </label>
            <div className='error-container'>
                {errors.private && <p className='errors'>{errors.private}</p>}
            </div>
            {formType === 'create' &&
                <>
                    <p>Please add an image url for your group below:</p>
                    <input
                        type="url"
                        placeholder='Image Url'
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <div className='error-container'>
                        {errors.image && <p className='errors'>{errors.image}</p>}
                    </div>
                </>
            }
            <div className="split" />
        </>
    )
}