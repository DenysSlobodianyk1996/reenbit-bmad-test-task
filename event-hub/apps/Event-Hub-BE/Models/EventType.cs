using System.Runtime.Serialization;

namespace Event_Hub_BE.Models;

public enum EventType
{
    [EnumMember(Value = "PageView")]
    PageView = 0,
    [EnumMember(Value = "Click")]
    Click = 1,
    [EnumMember(Value = "Purchase")]
    Purchase = 2
}
