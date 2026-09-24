import "./Profile.css";
function Profile()
{
    const user=JSON.parse(localStorage.getItem("user"));
  if(!user)
  {
return (
    <div>
        <h2>please login</h2>
    </div>
);
  }
  
    return (
      <div className="profile-page">
        <div className="profile-card">
            <h2>My profile</h2>
            <div className="profile-info">
<div className="profile-item">
    <strong>Username</strong>
    <span>{user.username}</span>
</div>
<div className="profile-item">
    <strong>Email</strong>
    <span>{user.email}</span>
</div>
<div className="profile-item">
    <strong>City</strong>
    <span>{user.city}</span>
</div>
<div className="profile-item">
    <strong>State</strong>
    <span>{user.state}</span>
</div>
<div className="profile-item">
    <strong>Country</strong>
    <span>{user.country}</span>
</div>
            </div>
        </div>
      </div>
    );
}
export default Profile;